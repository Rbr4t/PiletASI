import os
from reportlab.pdfgen.canvas import Canvas
from reportlab.lib.units import cm
import smtplib
import ssl
from email import encoders
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase


def saada_email(
        receiver_email: str, start: str,
        destination: str,
        ticket_id: int,
        name: str,
        departure: str, arrival: str,
        transport: str, info=[]):
    canvas = Canvas("pilet.pdf")
    canvas.setFont("Times-Roman", 48)
    canvas.drawString(2 * cm, 27.7 * cm, "PILET")

    sender_email = "piletasitest@gmail.com"
    password = "vpgq myoc hzlr dgkh"

    message = MIMEMultipart("alternative")
    message["Subject"] = "PiletASI"
    message["From"] = sender_email
    message["To"] = receiver_email

    # Create the plain-text and HTML version of your message
    text = f"""\
    Tere, {name}!
    Teie {transport} alustab {departure} kohast {start} ja lõpetab {arrival} kohas {destination}.
    pileti ID: {ticket_id}
    Ajagraafik: 
    """

    html = f"""\
    <html>
        <body style="font-family: Roboto; color: black;">
        <p>Tere, {name}! <br>
            Teie {transport} alustab {departure} kohast {start} ja lõpetab {arrival} kohas {destination}. <br>
            pileti ID: {ticket_id} <br>
            Ajagraafik: <br>
    """

    pdf_sisu = f"""\
    Ostja: {name}
    Algpeatus: {start}
    Väljumisaeg: {departure}
    Lõpppeatus: {destination}
    Saabumisaeg: {arrival}
    Ajagraafik:
    """

    for asi in info:
        rida = asi["peatus"] + ": " + asi["väljumine"]
        text += rida + "\n"
        html += rida + "<br>"
        pdf_sisu += rida + "\n"

    html += """\
        </p>
        </body>
    </html>
    """

    canvas.setFont("Times-Roman", 18)
    for i, rida in enumerate(pdf_sisu.splitlines()):
        canvas.drawString(2 * cm, (25.7 - i) * cm, rida.strip())

    canvas.save()

    # Turn these into plain/html MIMEText objects
    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")

    with open("pilet.pdf", "rb") as attachment:
        # Add file as application/octet-stream
        # Email client can usually download this automatically as attachment
        part3 = MIMEBase("application", "octet-stream")
        part3.set_payload(attachment.read())

    # Encode file in ASCII characters to send by email
    encoders.encode_base64(part3)

    part3.add_header(
        "Content-Disposition",
        "attachment; filename= pilet.pdf",
    )

    # Add HTML/plain-text parts to MIMEMultipart message
    # The email client will try to render the last part first
    message.attach(part1)
    message.attach(part2)
    message.attach(part3)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(
            sender_email, receiver_email, message.as_string()
        )

    os.remove("pilet.pdf")
