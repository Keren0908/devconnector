import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteProfile } from "../../actions/profileActions";
import Loading from '../common/Loading';
import { Link } from 'react-router-dom';
import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';

class Dashboard extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e){
    this.props.deleteProfile();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;

    //if (profile === null || loading) 
    if (loading){
      dashboardContent = <Loading />
    } else {
      // Check if logged in user has profile data
      if(profile !== null && Object.keys(profile).length > 0) {
        dashboardContent = (
        <div>
          <p className="lead text-muted">Welcome <Link to={`/profile/${profile.handle}`} >{ user.name }</Link></p>
          <ProfileActions />
          <Experience experience={profile.experience}/>
          <Education education={profile.education} />
          <div stype={{ marginBottom: '60px' }} >
            <button onClick={this.onDeleteClick.bind(this)} className="btn btn-danger"> Delete My Profile</button>
          </div>

        </div>
        
        )
      }
      else {
        //User is logged in but has no profile
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome { user.name }</p>
            <p>You have not yet setup a profile, pleaase add some info</p>
            <Link to='/create-profile' className="btn btn-lg btn-info">
            Create Profile
            </Link>
          </div>
        )
      }
    }

    return (
      <div className='dashboard'>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteProfile }
)(Dashboard);
