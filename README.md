# PiletASI
Pileti ostmise ja kontrollimise veebirakendus ASI Karikas võistluse jaoks.

Backendi käivitamiseks:
1. liigu backend kausta
2. käivita venv käsuga `.\venv\Scripts\activate`
3. lae alla vajalikud dependencies käsuga `pip install -r ../requirements.txt`
4. käivita backend käsuga `uvicorn main:app --reload`

Frontend käivitamiseks:
1. liigu frontend kausta
2. lae alla vajalikud dependencies
3. käivita frontend käsuga `npm run dev`