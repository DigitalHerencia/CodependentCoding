export type LocalUserContext = {
  id: string
  clerkUserId: string
  email: string | null
  displayName: string | null
  status: "active" | "disabled"
  isApplicationAdmin: boolean
}

export type AuthenticatedUserContext = {
  userId: string
  localUser: LocalUserContext
}
