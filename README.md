# Easy Marks

### Welcome to the Easy Marks repository!

## Tech Stack
__Frontend:__ React JSX

__Backend:__ Python/Flask

__Database:__ MongoDB

__Dev/Prod Host:__ Heroku

## Get Started

1. Clone this repository:
```bash
git clone https://github.com/labrocadabro/easy-marks.git
```

2. Pip install `requirements.txt`:
```bash
pip install -r requirements.txt
```

3. Install `node_modules` in the `frontend` folder:
```bash
cd frontend
npm install
```

## To Run

1. In the top level directory run `Flask`:
```bash
flask --app run --debug run
```

2. In another terminal, run the `queue_worker.py` script:
```bash
python queue_worker.py
```

3. In another terminal, change directory into the `frontend` folder:
```bash
cd frontend
```

4. Run the development environment with `npm`:
```bash
npm run dev
```
