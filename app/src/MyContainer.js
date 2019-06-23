import MyComponent from './MyComponent'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => ({
  accounts: state.accounts,
  SimpleStorage: state.contracts.SimpleStorage,
  TutorialToken: state.contracts.TutorialToken,
  BassetContract: state.contracts.BassetContract,
  drizzleStatus: state.drizzleStatus
})

const MyContainer = drizzleConnect(
  MyComponent,
  mapStateToProps
)

export default MyContainer
