import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ProfileAbout from "./ProfileAbout";
import ProfileCreds from "./ProfileCreds";
import ProfileHeader from "./ProfileHeader";
import ProfileGithub from "./ProfileGithub";
import Loading from "../common/Loading";
import { getProfileByHandle } from "../../actions/profileActions";

class Profile extends Component {
  componentDidMount() {
    if (this.props.match.params.handle) {
      console.log(this.props.match.params.handle);
      this.props.getProfileByHandle(this.props.match.params.handle);
    }
  }

  render() {

    const { profile, loading } = this.props.profile;
    let profileContent;

    if(profile === null || loading){
        profileContent = <Loading />
    }
    else{
        profileContent = (
        <div>
            <div className='row'>
                <div className="col-md-6">
                    <Link to='/profiles' classname='btn btn-light mb-3 float-left'>
                        Back To Profiles
                    </Link>
                </div>
                <div className="col-md-6"></div>
            </div>
            <ProfileHeader profile={profile} />
            <ProfileAbout />
            <ProfileCreds />
            <ProfileGithub />
        </div>
        )
    }

    return (
        <div className='profile'>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        {profileContent}
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

Profile.propTypes = {
  getProfileByHandle: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    profile: state.profile,
   
  });

export default connect(
  mapStateToProps,
  { getProfileByHandle }
)(Profile);
