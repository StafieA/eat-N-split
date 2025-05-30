import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  console.log(selectedFriend);

  function handleAddFriend(friend) {
    setFriendList((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((currentlySelected) =>
      currentlySelected?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  function handleSplit(value) {
    console.log(value);
    setFriendList((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendList={friendList}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            onAddFriend={handleAddFriend}
            friendList={friendList}
          />
        )}
        <Button onClick={() => setShowAddFriend((show) => !show)}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplit}
        />
      )}
    </div>
  );
}

export default App;

function FriendsList({ friendList, onSelection, selectedFriend }) {
  const friends = friendList;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  // function handleSelectFriend(friend) {
  //   console.log(friend);
  //   // setSelectedFriend(friend.id);
  // }
  const selected = selectedFriend?.id === friend.id;
  return (
    <li className={selected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€{" "}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€{" "}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelection(friend)}>
        {selected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FormAddFriend({ setFriendList, onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=933372");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    console.log(e.target);
    const id = crypto.randomUUID();
    const newFriend = { name, image: `${image}?=${id}`, balance: 0, id };

    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=933372");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="name">👯Friend name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="image">📸 Image URL</label>
      <input
        id="image"
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : 0;
  const [whoPays, setWhoPays] = useState("user");

  function handleBill(e) {
    setBill(Number(e.target.value));
  }

  function handleUserPaid(e) {
    // if (e.target.value > bill) return;
    setPaidByUser(
      bill < Number(e.target.value) ? paidByUser : Number(e.target.value)
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoPays === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label htmlFor="bill">💸Bill value</label>
      <input id="bill" type="text" value={bill} onChange={handleBill} />

      <label htmlFor="myexpense">🧑‍🍼Your expense</label>
      <input
        id="myexpense"
        type="text"
        value={paidByUser}
        onChange={handleUserPaid}
      />

      <label htmlFor="friendexpense">
        🧑🏼‍🤝‍🧑{selectedFriend.name}'s expense
      </label>
      <input id="friendexpense" type="text" disabled value={paidByFriend} />

      <label>Who is paying the bill ??? 🤔</label>
      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
