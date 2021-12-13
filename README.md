
# CS 546 Web Programming I Final Project: Work For U
This is a B2B web platform for employers/company and freelancers where employers can 
find their desired freelancers and keep track of their projects, and freelancers can choose from the 
employers who want to work with them and also showcase their past projects.

Built using Express, Node.js, MongoDB ,React and Chakra UI.

## How to Setup 
For backend:
1. cd back-end
2. npm i
3. npm run seed
4. npm start

For front-end:
1. cd front-end
2. cd work-for-u
3. Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
4. npm install -g yarn
5. yarn
6. yarn run dev

## How the Application Works
- Main page: When the user (Employers/Freelancers) sign in, employers will be displayed 
available freelancers along with a rating and location. Freelancers will be displayed a dashboard 
of open projects
- Search page: Employer can find freelancer based on skillset, location, and name. Freelancers can 
filter the available projects based on the same factors
- Creating Request: Employer will create a request for the desired freelancer by selecting the 
project he wants to hire the freelancer depending on the skillset and the price proposed by the 
employer
- View Profile: Employers can view freelancers’ profile and vice versa.
- View (Main page): Freelancers can view the project description along with skillset required.
- Creating Project: Employer will have a screen where he can create projects by entering its 
description and skillset required. Employer can later use them while making request to a 
freelancer
- Rating and Review (Freelancer page): Employers can rate and review the freelancer for the 
project he/she got hired for. This rating and review can be viewed publicly in the freelancer’s 
profile
- History: Allows the freelancer and employer to view current/past projects along with status (not 
started, in progress, successfully completed)
- Recommendation system: The employers will get recommendation of freelancers depending on 
the skillset required by the employer and the success rate of the freelancer


## Additional Extra Features
- Success Rate: Shows the freelancers successful completion of projects according to skillset 
(labels) in the form of graph (Pie or bar chart)
- Blacklisting: Freelancers can block a company if the freelancer does not want to see request 
from that employer anymore

Employer username and password:
-aman@gmail.com, aman1234
-ameya@gmail.com, ameya1234

Freelancer username and password:
-joe@gmail.com, joe1234
-rohan@gmail.com, joe1234
-vidhi@gmail.com, vidhi1234
-emma@gmail.com, emma1234

## GitHub Link
https://github.com/amanpawar507/Group_9_CS546_A
