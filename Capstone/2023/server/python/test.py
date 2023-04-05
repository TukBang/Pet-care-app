import sys, os

print(__file__)
print(os.path.dirname(__file__))
print(os.path.abspath(os.path.dirname(__file__)))
print(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
print(os.path.dirname(os.path.dirname((os.path.dirname(__file__)))))