# Microservices Demonstration

## About:
A project for school created to demonstrate the best way to communicate information for a large scale web service. Created as microservices with docker so that as more power is needed to handle server requirements it could easily be brought up and continue to seamlessly communicate and keep up with demand 

## Features: 

### Diagram of the web microservices reliances:
The front facing web service goes through the API to communicate with any other service, the API goes through the logger for logging the current actions taken by the user, From the logger it goes to the destination and then back through the logger so that once again the information is captured. All information was stored in a MongoDB cloud storage when in use.
![diagram](https://FakeTails/Microservices-Demonstration/blob/master/README_images/SEM_Diagram.PNG?raw=true)

</br> Designed and developed by Joshua LaRocca, Alexander Bachmann, and Julie Thompson.