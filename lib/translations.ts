export type Language = "en" | "fr"

export const translations = {
  en: {
    // Common
    appName: "Amen Cash",
    login: "Login",
    logout: "Logout",
    signup: "Sign Up",
    signUp: "Sign up",
    cancel: "Cancel",
    create: "Create",
    add: "Add",
    pay: "Pay",
    paid: "Paid",
    cancelled: "Cancelled",
    pending: "Pending",
    demo: "Demo",

    // Landing Page
    heroTitle: "Split expenses with friends, simply and fairly",
    heroDescription:
      "Track shared expenses, settle up with friends, and keep your finances organized. Amen Cash makes splitting bills effortless.",
    getStartedFree: "Get Started Free",
    easyGroupManagement: "Easy Group Management",
    easyGroupManagementDesc:
      "Create groups for trips, roommates, or any shared expenses. Find friends by email or username.",
    smartExpenseSplitting: "Smart Expense Splitting",
    smartExpenseSplittingDesc: "Split bills equally or by custom amounts. Track who owes whom and settle up easily.",
    clearBalanceOverview: "Clear Balance Overview",
    clearBalanceOverviewDesc: "See at a glance who you owe and who owes you. Keep everyone accountable and on track.",

    // Auth
    welcomeBack: "Welcome back",
    enterCredentials: "Enter your credentials to access your account",
    emailOrUsername: "Email or Username",
    password: "Password",
    confirmPassword: "Confirm Password",
    loggingIn: "Logging in...",
    dontHaveAccount: "Don't have an account?",
    createAccount: "Create an account",
    getStartedToday: "Get started with Amen Cash today",
    email: "Email",
    username: "Username",
    displayName: "Display Name",
    creatingAccount: "Creating account...",
    alreadyHaveAccount: "Already have an account?",
    passwordsDoNotMatch: "Passwords do not match",
    usernameTooShort: "Username must be at least 3 characters",

    // Dashboard
    welcomeBackUser: "Welcome back,",
    manageGroupsExpenses: "Manage your groups and expenses",
    createGroup: "Create Group",
    noGroupsYet: "No groups yet",
    noGroupsDesc: "Create your first group to start splitting expenses with friends",
    createFirstGroup: "Create Your First Group",
    addExpense: "Add Expense",
    member: "member",
    members: "members",
    created: "Created",

    // Groups
    createNewGroup: "Create New Group",
    createGroupDesc: "Create a group to split expenses with friends",
    groupName: "Group Name",
    description: "Description",
    descriptionOptional: "Description (optional)",
    addMembers: "Add Members",
    searchByEmailUsername: "Search by email or username",
    creating: "Creating...",
    createGroupButton: "Create Group",

    // Expenses
    addExpenseTitle: "Add Expense",
    addExpenseDesc: "Add a new expense to split with group members",
    descriptionLabel: "Description",
    amount: "Amount",
    splitBetween: "Split between",
    adding: "Adding...",
    addExpenseButton: "Add Expense",
    pendingExpenses: "Pending Expenses",
    settledExpenses: "Settled Expenses",
    noPendingExpenses: "No pending expenses",
    paidBy: "Paid by",
    youPaidThis: "You paid this expense",
    youvePaid: "You've paid",
    youOwe: "You owe",
    paymentsReceived: "Payments received:",
    loadingExpenses: "Loading expenses...",
    splitBetweenCount: "Split between",
  },
  fr: {
    // Common
    appName: "Amen Cash",
    login: "Connexion",
    logout: "Déconnexion",
    signup: "Inscription",
    signUp: "S'inscrire",
    cancel: "Annuler",
    create: "Créer",
    add: "Ajouter",
    pay: "Payer",
    paid: "Payé",
    cancelled: "Annulé",
    pending: "En attente",
    demo: "Démo",

    // Landing Page
    heroTitle: "Divisez les dépenses avec vos amis, simplement et équitablement",
    heroDescription:
      "Suivez les dépenses partagées, réglez avec vos amis et gardez vos finances organisées. Amen Cash facilite le partage des factures.",
    getStartedFree: "Commencer gratuitement",
    easyGroupManagement: "Gestion de groupe facile",
    easyGroupManagementDesc:
      "Créez des groupes pour les voyages, les colocataires ou toute dépense partagée. Trouvez des amis par email ou nom d'utilisateur.",
    smartExpenseSplitting: "Division intelligente des dépenses",
    smartExpenseSplittingDesc:
      "Divisez les factures de manière égale ou par montants personnalisés. Suivez qui doit à qui et réglez facilement.",
    clearBalanceOverview: "Vue d'ensemble claire du solde",
    clearBalanceOverviewDesc:
      "Voyez en un coup d'œil qui vous devez et qui vous doit. Gardez tout le monde responsable et sur la bonne voie.",

    // Auth
    welcomeBack: "Bon retour",
    enterCredentials: "Entrez vos identifiants pour accéder à votre compte",
    emailOrUsername: "Email ou nom d'utilisateur",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    loggingIn: "Connexion...",
    dontHaveAccount: "Vous n'avez pas de compte?",
    createAccount: "Créer un compte",
    getStartedToday: "Commencez avec Amen Cash aujourd'hui",
    email: "Email",
    username: "Nom d'utilisateur",
    displayName: "Nom d'affichage",
    creatingAccount: "Création du compte...",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    passwordsDoNotMatch: "Les mots de passe ne correspondent pas",
    usernameTooShort: "Le nom d'utilisateur doit comporter au moins 3 caractères",

    // Dashboard
    welcomeBackUser: "Bon retour,",
    manageGroupsExpenses: "Gérez vos groupes et dépenses",
    createGroup: "Créer un groupe",
    noGroupsYet: "Aucun groupe pour le moment",
    noGroupsDesc: "Créez votre premier groupe pour commencer à partager les dépenses avec vos amis",
    createFirstGroup: "Créer votre premier groupe",
    addExpense: "Ajouter une dépense",
    member: "membre",
    members: "membres",
    created: "Créé",

    // Groups
    createNewGroup: "Créer un nouveau groupe",
    createGroupDesc: "Créez un groupe pour partager les dépenses avec vos amis",
    groupName: "Nom du groupe",
    description: "Description",
    descriptionOptional: "Description (optionnel)",
    addMembers: "Ajouter des membres",
    searchByEmailUsername: "Rechercher par email ou nom d'utilisateur",
    creating: "Création...",
    createGroupButton: "Créer un groupe",

    // Expenses
    addExpenseTitle: "Ajouter une dépense",
    addExpenseDesc: "Ajouter une nouvelle dépense à partager avec les membres du groupe",
    descriptionLabel: "Description",
    amount: "Montant",
    splitBetween: "Divisé entre",
    adding: "Ajout...",
    addExpenseButton: "Ajouter une dépense",
    pendingExpenses: "Dépenses en attente",
    settledExpenses: "Dépenses réglées",
    noPendingExpenses: "Aucune dépense en attente",
    paidBy: "Payé par",
    youPaidThis: "Vous avez payé cette dépense",
    youvePaid: "Vous avez payé",
    youOwe: "Vous devez",
    paymentsReceived: "Paiements reçus:",
    loadingExpenses: "Chargement des dépenses...",
    splitBetweenCount: "Divisé entre",
  },
} as const

export function getTranslation(lang: Language) {
  return translations[lang]
}
