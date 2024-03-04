# PiletASI
Pileti ostmise ja kontrollimise veebirakendus, mis saadab ka pileti emaili.ASI Karikas 2024 võistluse jaoks. 

Põhilised kasutatud tehnoloogiad: **React** (kasutajaliides), **FastAPI** (serveri liides), **SQLite** (andmebaasi tarkvara), **MaterialUI** (Reacti komponentide raamistik)

## Rakenduse käivitamine

Klooni projekt

```bash
  git clone https://github.com/Rbr4t/PiletASI.git
```

Navigeeri /backend kausta

```bash
  cd PiletASI/backend
```

Loo virtuaalkeskkond (soovituslik) 

Käivita virtuaalkeskkond (venv) käsuga (soovituslik)

Windows:
```bash
`.\venv\Scripts\activate`
```

Mac/Linux:
```bash
`source ../venv/bin/activate`
```

Installi vajalikud moodulid

```bash
  pip install -r ../requirements.txt
```

Käivita rakendus

```bash
  uvicorn main:app --reload
```

### Frontendi arenduskeskkonna käivitamine (vajab Node.js arenduskeskkonda)



Navigeeri /frontend kausta

```bash
  cd PiletASI/frontend
```

Installi vajalikud moodulid

```bash
  npm i
```

Käivita rakendus

```bash
  npm run build
```

*Frontendi muutused võtavad keskeltläbi 7s aega, enne kui see backendi kohale jõuab, Vite on kiire, aga rakenduse disaini tõttu peab backendi jaoks koostama iga kord kogu projekti.*


## Kasutusjuhend

> NB!: andmebaas on rakenduse käivatamisel tühi, marsruudid tuleb enne ise admini õigustega lisada, muidu ei näe pileteid.   

- Adminile:
    - Admini õiguste saamiseks tuleb `backend/admins.txt` faili oma kasutajaga seotud emaili aadress lisada.
    - Adminid saavad lisada uusi marsruute kodulehelt kättesaadava "Admini paneel" läbi.

- Tavakasutajale
    - Tavakasutaja saab luua kasutajat, kui valib "Logi sisse" ja sealt alt "Puudub kasutaja? Registreeri"
    - Pileteid saab kontrollida ja osta ilma kasutajata, aga kasutajakontoga on pileti ostmine lihtsam, sest 3 välja on juba eelnevalt täidetud.


## Kuvatõmmised

![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)
![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)
![alt text](https://github.com/[username]/[reponame]/blob/[branch]/image.jpg?raw=true)


> ajapuuduse tõttu ei saanud rakendust nii palju viimistleda ja võib kohata *bug*-e

