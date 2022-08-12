import { FC, useState, FormEvent, ChangeEvent, useContext } from "react";
import { Alert, Form, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { API_URL, FetchingDataStatus, Endpoints } from "../../../app/constans";
import { postOptions } from "../../../app/utils";
import { RefreshContext } from "../../../context/RefreshContext";
import { UserContext } from "../../../context/UserContext";
import { IInvoicesData } from "../../../interfaces";
import { SaveButton } from "../../links/SaveButton";

interface IComponentState {
  invoicesData: Partial<IInvoicesData>;
  status: FetchingDataStatus;
}

export const AddInvoiceData: FC = () => {
  const [data, setData] = useState<IComponentState["invoicesData"]>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setRefreshContext } = useContext(RefreshContext);
  const { userContext } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: keyof IInvoicesData): void => {
    setData({ ...data, [key]: e.currentTarget.value });
  }

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const {
      first_name,
      last_name,
      company_name,
      company_vat_number,
      company_address,
      company_phone,
      company_email } = data;

    if (first_name && last_name && company_name && company_vat_number && company_address && company_phone && company_email) {
      const body = JSON.stringify({
        first_name,
        last_name,
        company_name,
        company_vat_number,
        company_address,
        company_phone,
        company_email
      })
      fetch(API_URL + Endpoints.ADD_INVOICES_DATA, { ...postOptions(userContext.token), body: body })
        .then(res => res.json())
        .then((result) => {
          console.log(result);
          setRefreshContext({ refreshId: uuidv4() });
          navigate(Endpoints.INVOICES_DATA);
        });
    } else {
      setError("Należy uzupełnić wszystkie pola!");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 id="table-heading">Tworzenie danych do faktury</h1>
      <form className="text-start custom-form" onSubmit={handleSubmit}>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Imię</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz swoje imię"
            value={data.first_name}
            onChange={(e) => handleChange(e, "first_name")} />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Nazwisko</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz swoje nazwisko"
            value={data.last_name}
            onChange={(e) => handleChange(e, "last_name")} />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Nazwa firmy</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz pełną nazwę firmy"
            value={data.company_name}
            onChange={(e) => handleChange(e, "company_name")} />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">NIP</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz numer NIP firmy"
            value={data.company_vat_number}
            onChange={(e) => handleChange(e, "company_vat_number")} />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Adres</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz dane adresowe firmy"
            value={data.company_address}
            onChange={(e) => handleChange(e, "company_address")} />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Telefon</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz telefon firmowy"
            value={data.company_phone}
            onChange={(e) => handleChange(e, "company_phone")} />
        </FormGroup>
        <FormGroup
          className="text-start mb-3">
          <Form.Label className="fw-bold">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Wpisz email firmowy"
            value={data.company_email}
            onChange={(e) => handleChange(e, "company_email")} />
        </FormGroup>
        <SaveButton isSubmitting={isSubmitting} endpoint={Endpoints.INVOICES_DATA} />
      </form>
    </>
  );
}
