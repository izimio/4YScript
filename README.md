# 🚀 Epitech Student Analyzer 🎓

Welcome to the Epitech Student Analyzer repository! This JavaScript script allows you to gather information about Epitech students based on their tokens and optionally from a list of emails.

# Terms of Use 🚨

> ⚠️ **Warning:** Do not use this script to track someone else's GPA or Epitech Intra information. This script is intended for personal use only, specifically on your own Epitech profile. The author disclaims any responsibility for misuse or any consequences you may face for unauthorized use.


## Features
- Retrieve student information such as GPA, TEPitech grade, credits, and more.
- Rank students based on GPA and a personalized score.
- Option to process a list of students from an `email.txt` file.

## Prerequisites
- Node.js installed on your machine.
- pnpm installed globaly on your machine
- A valid Epitech token.

## Setup
1. Clone this repository to your local machine.
2. Install dependencies using `pnpm install`
3. Fill the .env.schema with you Epitech JWT Tokens


# How to Find Your Epitech JWT 🌐

Follow these steps to locate your Epitech JWT (JSON Web Token):

1. **Connect to your Epitech Intra Account:**
   - Access your Epitech Intra account through the official website.

2. **Open the Dev Console:**
   - Right-click on the page and select "Inspect" or press `F12` to open the browser's developer console.

3. **Navigate to the "Application" Section:**
   - In the developer console, find and select the "Application" tab.

4. **Explore the Cookies Section:**
   - Look for the 🍪 Cookies accordion and expand it.

5. **Access Epitech Intra Cookies:**
   - Locate and click on the cookies associated with `https://intra.epitech.eu/`.

6. **Find Your JWT:**
   - In the list of cookies, search for the "user" row.
   - Retrieve the value; it should start with something resembling `eyJ0eXA...`.

Note: Ensure that you keep your JWT secure and do not share it with others. This token is sensitive information that provides access to your Epitech Intra account.


## Usage
### With a Single Email
```bash
node script foo.bar@epitech.eu
```

Replace `<email>` with the student's Epitech email.

### With a List of Emails
1. Add each Epitech email to a new line in `email.txt`.
2. Run the script without any arguments:

```bash
node script.js
```

## Results
- The script generates a `students.json` file containing detailed information about each student.
- Students are ranked by both GPA and a personalized score.


## Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.
