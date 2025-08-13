const RecipientInfo = ({ recipient, postCode }) => {
    return (
        <div className="row mb-4">
            <div className="col-md-6">
                <h6 className="fw-bold mb-1">{recipient.name}</h6>
                <p className="text-muted mb-1">{recipient.phone}</p>
                <p
                    className="text-muted mb-0"
                >
                    {recipient.address},
                    {recipient.ward},
                    {recipient.province}
                </p>
            </div>
            <div className="col-md-6 text-end">
                <small className="text-muted">Mã bưu điện</small><br />
                <small className="text-muted">{postCode}</small>
            </div>
        </div>
    );
}

export default RecipientInfo;