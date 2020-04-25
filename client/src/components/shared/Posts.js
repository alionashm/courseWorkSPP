import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Pagination from "react-js-pagination"

import { UPDATE_POSTS } from '../../actions/types'
import { getAll } from '../../actions/post'

import Post from './Post'
import Loader from './Loader'

const LIMIT = 10

let postsOnPage = []

class Posts extends React.Component {

  constructor() {
    super()
    this.state = { 
      activePage: 1,
      search:"",
      searchWidth: 0,
      clicked: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    this.props.getAll(this.getQueryParams())
  }

  componentDidUpdate() {
    if(this.state.postsOnPage != this.props.post) {
      this.setState({postsOnPage: this.props.post})
    }
  }

  onPageChange = (activePage) => {
    this.setState({ activePage }, () => {
      this.props.getAll(this.getQueryParams())
    })
  }

  getQueryParams() {
    return Object.assign(
      {
        skip: (this.state.activePage - 1) * LIMIT,
        limit: LIMIT
      },
      this.props.queryParams
    )
  }

  handleChange(e) {
    this.setState({search: e.target.value})     
  }

  handleClick(){
    if(this.state.clicked) {
      this.setState({searchWidth: 0, clicked: false})
    } else {
      this.setState({searchWidth: 228, clicked: true})
    }
  }

  render() {
    const { isLoading, posts, totalCount } = this.props.post
    let currentRec = []
    let newRec = []
    if (this.state.search !== ""){
      currentRec = posts;

      newRec = currentRec.filter(record => {
        const lc = record.body.toLowerCase();
        const filter = this.state.search.toLowerCase();
        return lc.includes(filter);
      });
    } else {
      newRec = posts;
    }
    postsOnPage = newRec
    return (
      <React.Fragment>
        <div className="search" onClick={this.handleClick}></div>
        <input type="text" style={{width: this.state.searchWidth}} className="searchInput" onChange={this.handleChange} placeholder="Search on this page..." />
        {isLoading && <Loader />}
        {!isLoading && totalCount === 0 && (
          <div className="text-center">
            <h2>There is nothing</h2>
          </div>
        )}
        {postsOnPage.map((p) => <Post post={p} key={p._id} TYPE={UPDATE_POSTS} />)}
        {!isLoading && totalCount > posts.length && (
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={LIMIT}
            totalItemsCount={totalCount}
            onChange={this.onPageChange}
            itemClass="page-item"
            linkClass="page-link"
          />
        )}
      </React.Fragment>
    )
  }
}

Posts.propTypes = {
  getAll: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  queryParams: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth
})

export default connect(mapStateToProps, { getAll })(Posts)
