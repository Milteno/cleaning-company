import { FC } from 'react';
import { ReturnToHomePage } from '../links/ReturnToHomePage';

export const ContactPage: FC = () => {
  return (<div className="container">
    <div className="row">
      <h1 className="table-heading">Skontaktuj się z nami</h1>
      <div style={{ width: "50%", margin: "25px auto" }}>
        <form method="POST">
          <div className="form-group mb-3">
            <label htmlFor={"firstName"}>Imię</label>
            <input required className="form-control" type="text" name="firstName" id="firstName" placeholder="Twoje imię" />
          </div>
          <div className="form-group mb-3">
            <label htmlFor={"message"}>Wiadomość</label>
            <textarea required className="form-control" name="message" id="message"
              placeholder="Twoja wiadomość(max. 500 znaków)" rows={8} maxLength={500}></textarea>
          </div>
          <p>
            <a className="btn btn-primary btn-lg">Wyślij</a>
          </p>
        </form>
        <ReturnToHomePage />
      </div>
    </div>
  </div >)
}