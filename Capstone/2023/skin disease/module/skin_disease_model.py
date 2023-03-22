ROW = 0
COLUMN = 1

import pickle as pkl
from tqdm import notebook
import numpy as np
import torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from torchvision import models
from torchvision import transforms

class Skin_Disease_Dataset(Dataset):
  def __init__(self, x, y, transforms):
    self.x = x
    self.y = y
    self.transforms = transforms

  def __len__(self):
    return len(self.y)
  
  def __getitem__(self, index: int):
    image = self.x[index]
    target = self.y[index].astype(np.float32)

    if self.transforms is None: 
        self.transforms = transforms.Compose([transforms.ToTensor()])
    image = self.transforms(image)

    return image, target
  
class Skin_Distinction_Model(nn.Module):
    def __init__(self, model, out_features, device, save_path):
        super().__init__()
        
        self.model = model
        self.output = nn.Linear(1000, out_features)
        
        self.device = device
        self.save_path = save_path
        self.history = {"train_loss": list(),
                        "valid_loss": list(),
                        "train_acc" : list(),
                        "valid_acc" : list()}
        self.best_loss = None
        self.best_acc  = None

    def forward(self, x):
        x = self.model(x)
        x = self.output(x)
        return x
    
    def fit(self, parameters):
        train_DataLoader = parameters["Train_DataLoader"]
        valid_DataLoader = parameters["Valid_DataLoader"]
        optimizer        = parameters["Optimizer"]
        criterion        = parameters["Loss_function"]
        epochs           = parameters['Epochs']

        for epoch in notebook.tqdm(range(epochs)):
            self.train(True)
            print("Epoch: %d/%d" % (epoch + 1, epochs))

            # train part
            batch_train_loss, batch_train_acc = list(), list()
            for i, (images, targets) in enumerate(train_DataLoader):
                optimizer.zero_grad()
                
                # cuda images, targets
                targets = targets.type(torch.LongTensor)
                images = images.to(self.device)
                targets = targets.to(self.device)

                # predict
                outputs = self(images)
                train_loss = criterion(outputs, targets)

                # backprop
                train_loss.backward()
                optimizer.step()

                value, labels = torch.max(outputs.data, dim=COLUMN)
                batch = targets.size(dim=ROW)
                train_acc = (labels == targets).sum().item() / batch * 100
                batch_train_loss.append(train_loss.item())
                batch_train_acc.append(train_acc)
            
            # train loss, acc
            tlv = sum(batch_train_loss) / len(batch_train_loss)
            tav = sum(batch_train_acc) / len(batch_train_acc)
            self.history["train_loss"].append(tlv)
            self.history["train_acc"].append(tav)
            print("Train - Loss: %.6f, Accuracy: %.2f" % (tlv, tav))
            
            # valid part
            if valid_DataLoader != None:
                self.train(False)

                batch_valid_loss, batch_valid_acc = list(), list()
                with torch.no_grad():
                    for i, (images, targets) in enumerate(valid_DataLoader):
                        # cuda images, targets
                        targets = targets.type(torch.LongTensor)
                        images = images.to(self.device)
                        targets = targets.to(self.device)

                        outputs = self(images).to(self.device)
                        valid_loss = criterion(outputs, targets)

                        value, labels = torch.max(outputs.data, dim=COLUMN)
                        batch = targets.size(dim=ROW)
                        valid_acc = (labels == targets).sum().item() / batch * 100
                        batch_valid_loss.append(valid_loss.item())
                        batch_valid_acc.append(valid_acc)

                vlv = sum(batch_valid_loss) / len(batch_valid_loss)
                vav = sum(batch_valid_acc) / len(batch_valid_acc)
                self.history["valid_loss"].append(vlv)
                self.history["valid_acc"].append(vav)
                print("Valid - Loss: %.6f, Accuracy: %.2f" % (vlv, vav))

                # validation loss가 가장 낮다면 저장
                if self.best_loss is None or self.best_loss > vlv:
                    self.best_loss = vlv
                    torch.save(self.state_dict(), self.save_path + "low_loss.pth")
                    print("Save model, validation loss:", vlv)
                
                # validation acc가 가장 높다면 저장
                if self.best_acc is None or self.best_acc < vav:
                    self.best_acc = vav
                    torch.save(self.state_dict(), self.save_path + "high_acc.pth")
                    print("Save model, validation acc:", vav)
            
            print(f"{epoch} epoch end lr: ", optimizer.param_groups[0]['lr'])
            with open(self.save_path + "last_history.pkl", "wb") as pkl_file:
                pkl.dump(self.history, pkl_file)

        self.train(False)
        return self.history
    
    def predict(self, x, norm = [[0.5, 0.5, 0.5], [0.5, 0.5, 0.5]]):
        pred = torch.tensor([]).to(self.device)
        tf = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(norm[0], norm[1])
        ])
        test_dataset = Skin_Disease_Dataset(x, np.zeros((len(x),), dtype="int64"), tf)
        test_data_loader = DataLoader(test_dataset, batch_size=128)
        
        self.train(False)
        with torch.no_grad():
            for i, (images, targets) in enumerate(notebook.tqdm(test_data_loader)):
                images = images.to(self.device)
                outputs = self(images).to(self.device)
                pred = torch.cat((pred, outputs.data))

        value, labels = torch.max(pred.data, dim=COLUMN)
        return pred, labels