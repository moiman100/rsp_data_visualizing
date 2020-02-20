# Playable ad event data visualizing project
## Workflow
You can use Docker and Docker Compose to run the app. Docker compose comes automatically with Docker Desktop.

If you want to add node modules on the host machine you also need Node.js to install them.

### First time setup
1. `git clone https://github.com/moiman100/rsp_data_visualizing.git`
2. `cd rsp_data_visualizing`
3. `npm install`
4. `docker-compose up --build`

Nodemon will automatically restart the server when changes are made files.

To stop the container use: `ctrl + C`.

To just start the container: `docker-compose up`.

### Adding node modules
1. stop the container
2. `npm install <module>`
3. Rebuild the container `docker-compose up --build -V`


## Git workflow
- **Current branch: master**
- `git pull`
  - Update the master branch with the latest changes.
- `git checkout -b working-branch-name`
  - Make a new branch and switch to it.
- **Current branch: working-branch-name**
- Make changes.
- `git add changed-files`
  - Stages changes to be committed.
  - `git add .` adds everything.
  - `git add file-path` adds just that file.
- `git commit -m "Commit message"`
  - Commits staged changes to local version history.
- `git pull origin master --rebase`
  - Updates the working branch with latest changes from master branch and replays your changes on top of it.
  - There might be conflicts you have to resolve.
  - **Use this at least before you make a pull request to make it mergeable with master.**
  - Using this every time before starting to work ensures that possible conflicts aren't as huge as if you only used it  before making a pull request.
- `git push --set-upstream origin working-branch-name`
  - Sends your branch to GitHub.
  - In the future you only can just use `git push` to update the branch in GitHub, because `--set-upstream` sets the default remote branch for your working branch.
- When the work is ready, make a pull request.
- Once the pull request is merged you may delete the working branch.
- `git checkout master`
  - Switches to master branch.
- **Current branch: master**
- `git branch -d working-branch-name`
  - Removes working-branch-name from your local repository.
- `git push origin -d working-branch-name`
  - Removes working-branch-name from GitHub.
  - You can also remove it from GitHub's interface either in the merged pull request or in branches page.
- `git fetch --prune`
  - Removes remote branches that don't exist anymore from your local repository.

### Additional Git instructions
If you have committed your changes and want to make a little fixup you can use `git commit --amend --no-edit` to add the changes to your last commit. This messes up the version history so you shouldn't do this with branches others are working on. 

If you have already pushed the commit to GitHub and you know others aren't using the branch you can do the amend. Since it messes the version history you must use force when pushing `git push -f`.

If you have multiple commits you would like to merge in to a one bigger commit, e.g.
one actual commit and multiple fixups after it, you can use rebase. Rebase messes the version history like amending a commit so what is written above applies here as well.
- `git rebase -i HEAD~X`
  - X is the number of latest commits you want to merge into one.
  - This will open your commit message editing tool and show you instructions.
  - There will be list of commits with "pick" before them.
  - Change the "pick" to "fixup" on the fixup commits and leave it as "pick" on the actual commit.
  - Save and close the editor.
