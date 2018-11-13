## Workflow Procedures for Team EPIC

#### NOTE:  Until unique environment is developed for this project, work in PythonData virtual environment

To ensure receipt of notifications on repo
	
- Navigate to GitHub repo page `vlarie/EPIC_team5_Project2`
- Under the main header bar on the right, select the drop down next to the eyeball and change notifications to `Watching`
  - You may also want to `Star` the repo 


### Branch naming conventions
lowercase first initial of person working branch + CamelCase of task being worked on
- e.g. tRandLatLng (for Troy's branch creating random latitudes and longitudes), tPlotGeocodes (for Troy's branch plotting coordinates)
Name branches relevant to task being developed
- gui, timeMap, dashboard, etc
	
	
	
## Procedure for merging to master
#### NOTE:  Merging to master should occur when one of these conditions has been met:
1. The code being merged is vital to the function or completion of other parts of the project in development
2. The code being merged is fully functional, no longer in development, and will not need any more major changes

Please ensure one or more of these conditions is met before submitting a pull request.
	
	
	
### Create branch using established naming conventions
terminal method:
- Create new branch

`git branch <branch_name>`

- Command to move between branches

`git checkout <branch_name or master>`

- Create and switch to branch in one line

`git checkout -b <branch_name>`



### Complete work on branch 
Work on a branch locally making commits often as code develops.



### Push branch to GitHub
terminal method:
- Updates branch specified on GitHub

`git push origin <branch_name>`



### Pull request to merge to master
After branch work is complete and you want to merge to master, navigate to GitHub.com repository online
- From the `<>Code` tab click `New pull request`   OR   from the `Pull request` tab click `New pull request`
- Compare changes - `base: master`   <-   `compare: <branch_name>`
- Add Valerie (aka vlarie) as reviewer and anyone else applicable, like people working on similar code
- Assign yourself
- Write any comments or notes
- Click `Create pull request`



### Merge to master
- Valerie will receive a notification of pull request and review within 12 hours* 
  - (*if there are extenuating circumstances preventing this, Valerie will communicate to individual submitting for review)
- If there are any changes to be made, Valerie will submit those back to the individual to be addressed within 12 hours if possible
- If no changes need to be made, Valerie will merge branch to master
	
	
	
### Pull changes from master	
- When branches are merged to master, team members should receive notification via email
- Each person should then update their local repo to incorporate changes

terminal method:	
- First navigate to relevant repo folder and make sure you have the branch you are working on checked out.  Use the following command to make sure your branch is clean

`git status`

  - If your branch is not clean, commit work you do not want to lose. Repeat the previous command to ensure your working branch is clean before proceeding.

- Once you have a clean working branch, use the following command to retrieve the latest changes from `master`

`git pull origin master`

  * This command performs `fetch` and `merge` at the same time.  If you prefer, you can also first call `git fetch` and `git status` to see where you are in relationship to `master`, then perform `pull` or `merge`.  

![GitFetch](https://github.com/vlarie/EPIC_team5_Project2/blob/master/notes/gitStatus1.PNG)
![GitPull](https://github.com/vlarie/EPIC_team5_Project2/blob/master/notes/gitStatus2.PNG)

#### NOTE: You may have to review differences/merge conflicts



### Removing unwanted files from repository
- If files are commited that you no longer want in the repo whatsoever, you can remove them from tracked files with the following command

`git rm --cached -f <filename>`

  * This command is especially helpful for files created by the operating system such as `.DS_Store` that have been committed accidently.  These files should also be added to the `.gitignore`.