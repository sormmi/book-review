import firebaseConfig from "./config";

class Firebase {
  constructor(app) {
    if(!firebaseInstance) {
      app = app.initializeApp(firebaseConfig);

      this.auth = app.auth();
      this.db = app.firestore();
      this.functions = app.functions("europe-west1");
      this.storage = app.storage();
    }
  }

  /**
   * Get user name by id
   * @param userId
   * @param onSnapshot
   * @returns {() => void}
   */
  getUserProfile({userId, onSnapshot}) {
    return this.db.collection('userProfiles')
      .where('userId', '==', userId)
      .limit(1)
      .onSnapshot(onSnapshot);
  }

  /**
   * Register a new user
   * @param username
   * @param email
   * @param password
   * @returns {Promise<void>}
   */
  async register({username, email, password}) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    const userProfileCallable = this.functions.httpsCallable('createUserProfile');
    userProfileCallable({username});
  }

  /**
   * Sign in with email and password
   * @param email
   * @param password
   * @returns {Promise<firebase.auth.UserCredential>}
   */
  async login({email, password}) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    await this.auth.signOut();
  }

  /**
   * Subscribe book comment changes
   * @param bookId
   * @param onSnapshot
   * @returns {() => void}
   */
  subscribeBookComments({bookId, onSnapshot}) {
    const bookRef = this.db.collection('books').doc(bookId);

    return this.db.collection('comments')
        .where('book', '==', bookRef)
        .orderBy('dateCreated', 'desc')
        .onSnapshot(onSnapshot);
  }

  /**
   * Post book comments
   * @param text
   * @param rating
   * @param bookId
   * @returns {Promise<firebase.functions.HttpsCallableResult>}
   */
  async postComment({text, rating, bookId}) {
    const postCommentCallable = this.functions.httpsCallable('postComment');
    return postCommentCallable({
        text,
        rating,
        bookId
      }).catch(error => {
        console.log(error);
      });
  }
} // end of class

let firebaseInstance;

function getFirebaseInstance(app) {
  if (!firebaseInstance && app) {
    firebaseInstance = new Firebase(app);
    return firebaseInstance;
  } else if (firebaseInstance) {
    return firebaseInstance
  }
  return null;
}

export default getFirebaseInstance;
