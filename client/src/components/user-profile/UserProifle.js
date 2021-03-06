import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getUserById } from '../../actions/user'
import Loader from '../shared/Loader'
import PostForm from '../shared/PostForm'
import Posts from '../shared/Posts'
import ProfileImage from '../shared/ProfileImage'
import Subscription from './Subscription'

class UserProfile extends React.Component {

  componentDidMount() {
    this.props.getUserById(this.props.match.params.id)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.isLoading && nextProps.user.user === null) {
      this.props.history.push('/404')
    }
  }

  render() {
    const { user: { user, isLoading }, auth } = this.props
    return !isLoading && user !== null ? (
      <React.Fragment>
            <div className="profile-row">
              <div style={{paddingLeft: "30%"}} className="col-4 text-center">
                <ProfileImage user={user} width={100}/>
              </div>
              <div style={{paddingLeft:"7px"}}>
                <h2 className="profile-username">{user.name}</h2>
                <p style={{fontSize:"12px"}}>
                  <strong>Registered: </strong>
                  {new Date(user.createdDate).toDateString()}
                </p>
              </div>
              
            </div>
        {!(auth.user.id === user._id) && (
          <div className="row mt-4">
            <div className="col-md-12 text-center">
              <div className="col-4 mx-auto">
                <Subscription userId={user._id} subLabel={false}/>
              </div>
            </div>
          </div>
        )}
        {(auth.user.id === user._id) && (
          <div className="row mt-4">
            <div className="col-md-12 text-center">
              <div className="col-4 mx-auto">
                <Subscription userId={user._id} subLabel={true}/>
              </div>
            </div>
          </div>
        )}
        <div className="row mt-4">
          <div className="col-md-6 mx-auto">
            {console.log("auth",auth.user.id)}
            {console.log("user",user._id)}

            {auth.user.id === user._id && <PostForm />}
            <Posts queryParams={{ user: user._id }} />
          </div>
        </div>
      </React.Fragment>
    ) : <Loader />
  }
}

UserProfile.propTypes = {
  getUserById: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user,
  auth: state.auth
})

export default connect(mapStateToProps, { getUserById })(UserProfile)
