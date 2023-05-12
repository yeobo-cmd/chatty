
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  apiKey: "AIzaSyBU5wjR92lwADUZnfnnzY1QsuzVG0rZ_Pc",
  authDomain: "chatty-63dc0.firebaseapp.com",
  projectId: "chatty-63dc0",
  storageBucket: "chatty-63dc0.appspot.com",
  messagingSenderId: "390846355118",
  appId: "1:390846355118:web:831a0aa3dd109339ef3f3f",
  measurementId: "G-MDV7KLGFDV"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

const [user] = useAuthState(auth);
function App() {
  return (
    <div className="App">
      <header className="App-header">
        
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn/>}
      </section>
    </div>
  );
}
function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Sign in with google</button>
  )
}
function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.SignOut}>SignOut</button>
  )
}
function ChatRoom(){
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) =>{
  
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,photoURL
    })
    setFormValue('');
    dummy.current.scrollIntoView({ behevior: 'smooth'});
  }





  return(
    <>
    <main>
    {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}

    <div ref={dummy}></div>
    </main>
     
    <form onSubmit={sendMessage}>
      <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>
      <button type="submit">❤</button>
    </form>
    </>
  )
}
function ChatMessage(props){
  const {text,uid,photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
<div className={'message ${messageClass}>'}>
<img src={photoURL} />
<p>{text}</p>
</div>
  )
}
export default App;
