# AWA Project

This repository contains the code for the AWA Project.

## Installation

1. Download the repository from GitHub: [AWA_project](https://github.com/AtteHil/AWA_project)

2. Navigate to the `/client` and `/server` folders using two different Git Bash windows.

3. Run the following command in both Git Bash windows:
```bash
  npm install 
```
4. Create a file named `.env` in the `/server` folder and add the following line:
SECRET=**Your own secret

5. Make sure you have MongoDB installed and running on port `mongodb://127.0.0.1:27017`.

## Usage

6. After downloading the required packages, run the following command in the Git Bash window for the `/client` side:
```bash
npm run dev
```
8. Run the following command in the Git Bash window for the `/server` side:
```bash
npm run start-dev
```
10. The server should now be up and running at [http://localhost:5173/](http://localhost:5173/).

## License

This project is licensed under the MIT License 
