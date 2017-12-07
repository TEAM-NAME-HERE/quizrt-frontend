import { connect } from 'react-redux';
import { State } from '../../reducers';
import Header from './Header';

const mapStateToProps = (state: State) => ({
  userId: state.user.uuid || state.user.name
});

export default connect(mapStateToProps)(Header);
