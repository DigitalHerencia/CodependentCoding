export const authHeaderContent = {
  homeHref: "/",
  homeLabel: "Back to home",
} as const;

export const authFooterContent = {
  rightsReserved: "All rights reserved.",
} as const;

export const authContent = {
  eyebrow: "On Security",
  title: "We take security very seriously.",
  description:
    "Our policies do not put users' data at risk. Their PII already got leaked...just not by us.",
} as const;

export const authAppearance = {
  elements: {
    rootBox: "w-full",
    cardBox: "w-full border-0 bg-transparent shadow-none",
    card: "w-full border-0 bg-transparent p-0 shadow-none",
    footer: "bg-transparent",
    headerTitle: "text-foreground",
    headerSubtitle: "text-foreground",
    formFieldLabel: "text-foreground",
    footerActionText: "text-foreground",
    footerActionLink: "text-foreground",
  },
} as const;

export const authPresentationCopy = {
  unableToConnectPleaseTryAgain: "Unable to connect. Please try again.",
  welcomeBack: "Welcome back",
  verifyYourIdentity: "Verify your identity",
  resetYourPassword: "Reset your password",
  enterYourUsernameAndPasswordToContinue:
    "Enter your username and password to continue.",
  enterYourUsernameToReceiveARecoveryCodeAt:
    "Enter your username to receive a recovery code at your verified email.",
  chooseANewPassword: "Choose a new password.",
  enterYourVerificationCodeToContinue:
    "Enter your verification code to continue.",
  username: "Username",
  newPassword: "New password",
  password: "Password",
  hidePassword: "Hide password",
  showPassword: "Show password",

  backupCode: "Backup code",
  verificationCode: "Verification code",

  pleaseWait: "Please wait…",
  signIn: "Sign in",
  sendRecoveryCode: "Send recovery code",
  continue: "Continue",
  unableToSendACodePleaseTryAgain: "Unable to send a code. Please try again.",
  resendCode: "Resend code",
  unableToSwitchVerificationMethodsPleaseTryAgain:
    "Unable to switch verification methods. Please try again.",
  backToSignIn: "Back to sign in",
  forgotPassword: "Forgot password?",
  newHere: "New here?",
  createAnAccount: "Create an account",
  verifyYourEmail: "Verify your email",
  enterTheCodeSentToYourEmailAddress:
    "Enter the code sent to your email address.",
  setUpYourAccount: "Set up your account.",
  email: "Email",
  verifyEmail: "Verify email",
  createAccount: "Create account",
  aNewCodeHasBeenSent: "A new code has been sent.",
  changeAccountDetails: "Change account details",
  alreadyHaveAnAccount: "Already have an account?",
} as const;

export const authRemainingCopy = {
  authenticatorApp: "Authenticator app",
  emailCode: "Email code",
  sMSCode: "SMS code",
  backupCode: "Backup code",
} as const;
