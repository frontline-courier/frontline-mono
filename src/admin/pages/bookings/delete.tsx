import { withPageAuthRequired } from '@auth0/nextjs-auth0/client'

function DeletePage() {
  return (
    <>
      <input type="checkbox" id="delete-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <p>Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut adipisci qui iusto illo eaque. Consequatur repudiandae et. Nulla ea quasi eligendi. Saepe velit autem minima.</p>
          <div className="modal-action">
            <label htmlFor="delete-modal" className="btn btn-primary">Accept</label>
            <label htmlFor="delete-modal" className="btn">Close</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default withPageAuthRequired(DeletePage);
