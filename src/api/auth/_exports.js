// Auth requests
import verifyToken from './verifyToken'
import verifyIfExistAdmin from './verifyIfExistAdmin'

// Auth account requests
import createAccount from './account/createAccount'
import closeMyAccount from './account/closeMyAccount'
import verifyUserAccount from './account/verifyUserAccount'

// Auth email requests
import verifyUserKey from './email/verifyUserKey'
import verifyUserEmail from './email/verifyUserEmail'
import verifyConfirmationCode from './email/verifyConfirmationCode'
import recoverUserEmail from './email/recoverUserEmail'
import sendEmailConfirmation from './email/sendEmailConfirmation'

// Auth password requests
import changeMyPassword from './password/changeMyPassword'
import recoverUserPassword from './password/recoverUserPassword'
import updateForgotPassword from './password/updateForgotPassword'
import sendPasswordConfirmation from './password/sendPasswordConfirmation'
import verifyPasswordConfirmationCode from './password/verifyPasswordConfirmationCode'

// Export requests
export {
	// Auth requests
	verifyToken,
	verifyIfExistAdmin,

	// Auth account requests
	createAccount,
	closeMyAccount,
	verifyUserAccount,

	// Auth email requests
	verifyUserKey,
	verifyUserEmail,
	verifyConfirmationCode,
	recoverUserEmail,
	sendEmailConfirmation,

	// Auth password requests
	changeMyPassword,
	recoverUserPassword,
	updateForgotPassword,
	sendPasswordConfirmation,
	verifyPasswordConfirmationCode,
}
