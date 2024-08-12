import { Row, Col, Card } from 'react-bootstrap';
import { formatDate } from '@/utils/formateDate';

const ActivitySetting = ({ user }) => {
    return (
        <Row className="mb-3">
            <Col xl={3} lg={3} md={12} xs={12}>
                <div className="mb-4 mb-lg-0">
                    <h4 className="mb-1">User Activity</h4>
                </div>
            </Col>
            <Col xl={9} lg={9} md={12} xs={12}>
                <Card>
                    <Card.Body>
                    <div class="d-flex flex-column gap-1">
                    <p class="dates text-muted d-flex align-items-center w-100">Created date:&nbsp;<small>{formatDate(user.createdDate)}</small></p>
  <p class="dates text-muted d-flex align-items-center w-100">Last Login date:&nbsp;<small>{formatDate(user.lastLoginDate)}</small></p>
  <p class="dates text-muted d-flex align-items-center w-100">Invitation date:&nbsp;<small>{formatDate(user.invitationDate)}</small></p>
  <p class="dates text-muted d-flex align-items-center w-100">Modified date:&nbsp;<small>{formatDate(user.modifiedDate)}</small></p>
</div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default ActivitySetting