import { ReturnToHomePage } from "../links/ReturnToHomePage"

export const PageNotFound = () => {
  return (
    <div className="container">
      <h1 id="table-heading">Błąd 404 Strona nie istnieje</h1>
      <div className="row text-center flex-wrap">
        <main style={{ padding: "1rem" }}>
          <p>Strona nie istnieje lub nie posiadasz uprawnień do jej wyświetlenia!</p>
          <ReturnToHomePage />
        </main>
      </div>
    </div>
  )
}