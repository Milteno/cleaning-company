import { Spinner } from "react-bootstrap"

export const Loader = () => {
  return (
    <div style={{ margin: "100px auto" }}>
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}