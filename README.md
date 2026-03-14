# Thought processes / Actions:
This is the human version of the steps and thought process used to create the tests in this repo (see CODEX-SUMMARY.md for the model's summary.)  All prompts were run using Codex with the gpt-5.4 medium model.

1) `git init` a new repo in a clean folder.

2) create an '.env' file with BASE_URL, USERNAME and PASSWORD variables, which match the given credentials for the site login.  

3) Prompt Codex to install all the required dependencies for running Playwright tests in this folder using TypeScript (NPM is already installed on my machine).  
    * **Prompt:** `Please perform the necessary setup to run Playwright tests in Typescript in this folder.`
    * Perform an initial commit/push to the remote GitHub repo after this is completed

4) Add `BASE_URL`, `USERNAME` and `PASSWORD` as repository secrets in the GitHub repo to avoid exposing these items in a public repo, and prompt Codex to create a reusable login function using the local values in `.env`  and the repository secrets in the repo.
    * **Prompt:**  `Create a reusable login function that uses the URL, username and password in the .env file (and which can use Github repository secrets to get these values for running with Github actions) and create a basic test that uses this.`
    * This analyzed the login page, created a login test and figured out verification steps, and also generated a `playwright.yml` file to automatically run the tests in the repo.  The login tests are running on push, and are green.

5) Now that we have the login sorted out, the next step is to build a page object for the web application.  
    * **Prompt:** `Now that we have a working login and some basic verification of the web application page, create a page object that encapsulates the functionality of the page.`
    * This created the 'project-board-page.ts' file with a page object definition, and modified the 'login.spec.ts' test case to use it.

6) Next, create Test Case 1, to verify that "Implement User Authentication" is present in the "To Do" column of the "Web Application" section.
    * **Prompt:** `First test case to write:  With the "Web Application" tab selected, verify that the "To Do" section contains an item labeled "Implement User Authentication", and verify that it has tags for both "Feature" and "High Priority".`
    * This created a working test, but created it on the assumption that the "To Do" section of the Web Application tab is unique.

7) Since we know that each of the column objects on all three sections should behave identically, the next step is to create a generic page object column that can be reused for any of those.
    * **Prompt:**  `This test case works, but some of the logic seems too specific to this one column.  Each of the three sections on this page (Web Application, Mobile Application and Marketing Campaign) will have four columns (To Do, In Progress, Review and Done) that should behave identically.  Ideally, I would like to have a function which will allow the user to specify a section, column and card title and get the tags (if any) associated with it.  That way, assertions can be made that a) the specified card is present, and b) the card has specific tags (which can be verified after retrieving the tags.`
    * This created a `getCardTags` function in project-board-page.ts which can retrieve tags by project name, column name and card title, and updated the test case in `web-application-todo-tags.spec.ts` to use the function.
    * This function uses a generic `card` helper function that asserts whether or not a card matching the specified project, column and title exists, and if it does retrieves the card as a locator.  

8) It's not going to be used for this specific exercise, but since we have a generic function to retrieve a card now, we can easily add functions to retrieve the other info on the card in a similar manner, so I prompted the model to add functions to retrieve the description and assignee for a given card title as well.
    * **Prompt**:  `Please also add functions that can retrieve assignees, descriptions and dates for each card using the same logic.  Do not modify any test cases with this info at this time; None of the current tests require this but future tests may need it.`
    * At this point I also created a new commit to ensure that the tests are still green in the repo.

9) The plumbing is in place now to add all the required tests, so it's time to add test case 3 (I accidentally skipped test case 2, so this will be slightly out of order):
    * **Prompt:**  `Now that we have the plumbing in place, it's time to add the next test.  Find a "Design System Updates" card in the "In Progress" column for Web Application, and verify that it has the "Design" tag.`

10) Now that we have a pretty good idea that this should work as expected, we can add the rest of the test cases in one prompt.
    * **Prompt:**
  ````
        That works as expected.  Now we need four more test cases:
        * Verify that there is a "Fix navigation bug" card in the To Do section of the Web Application project (no need to verify tags)
        * In the "Mobile Application" project, look for a "Push notification system" card with the "Feature" tag.
        * Also in the "Mobile Application" project, look for a "Offline mode" card with "Feature" and "High Priority" tags.
        * Finally, still in Mobile Application, verify that the "App icon design" card has the "Design" tag.
````
    *  This created the four remaining tests, which are similar to the existing ones.

11) The smoke.spec.ts and login.spec.ts tests are extraneous at this point, so I removed them (no prompt, `git rm` doesn't need any tokens to run.)

12) Now that we have the structure in place and know the tests are working as expected, the next step is to put this into a data-driven form that can be controlled by a JSON file.  
    * **Prompt**:  `I've done some test cleanup, and now we are down to the six requested tests.  The structures of these tests are very similar to each other, so it should be possible to make this test data-driven.  Create a data structure that contains the parameters used by the expectCardPresent and getCardTags functions which will allow these to be stored in a JSON file.`
    * This removed the individual tests, and replaced them all with a single 'card-checks.spec.ts' file that takes inputs from a 'tests/data/card-checks.json' file.  

13) At this point, adding checks for more cards/tags should only require editing the JSON file.  
    
# Potential Issues and Next Steps:
* In doing some testing with various values, I found that assertions for card titles do not appear to be case sensitive, but assertions for tags will break if there is not an exact match.  If you need this check to be case insensitive the easiest way to do this would be to cast the array values to lower case.  
* While I was working on this I did temporarily add some negative tests, which can be handled easily by Playwright assertions, but if there was a need to add data-driven negative tests, the easiest way to do this would probably be to put those into a separate JSON file pointing to a different .spec.ts file.  I did add an 'additional-tests' branch to the repo to do some additional tinkering, but that's going to be out of scope for this exercise.
* The data structure could also be modified to allow for verification of other parameters found on the cards.  There are functions in the page object to do this, but these are not being used by the current tests.  Again, this may end up being covered in the additional-tests branch.

