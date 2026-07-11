// Task on array methods

/*Data:
const users = [
  { id: 1, name: "John", age: 22, active: true },
  { id: 2, name: "Sara", age: 17, active: false },
  { id: 3, name: "Mike", age: 35, active: true },
  { id: 4, name: "Emma", age: 28, active: false },
  { id: 5, name: "David", age: 42, active: true }
];
Tasks
1. Count active users.
2. Count inactive users.
3. Find the average age.
4. Find the oldest user.
5. Find the youngest user.
6. Return only active users.
7. Return only user names.
8. Sort users by age descending.*/

const users = [
{ id: 1, name: "John", age: 22, active: true },
{ id: 2, name: "Sara", age: 17, active: false },
{ id: 3, name: "Mike", age: 35, active: true },
{ id: 4, name: "Emma", age: 28, active: false },
{ id: 5, name: "David", age: 42, active: true }
];

//1.count active users
const activeUsers = users.filter(user => user.active);

console.log(activeUsers.length);

//2.count inactive users
const inactiveUsers = users.filter(user => !user.active);

console.log(inactiveUsers.length);

//3.find the average age
const totalAge = users.reduce((sum, user) => sum + user.age, 0);

const averageAge = totalAge / users.length;

console.log(averageAge);

//4.find the oldest user

const oldestUser = users.reduce((oldest, user) => {
    return user.age > oldest.age ? user : oldest;
});

console.log(oldestUser);

//5. youngest user
const youngestUser = users.reduce((youngest, user) => {
    return user.age < youngest.age ? user : youngest;
});

console.log(youngestUser);

//6.only active users
const active = users.filter(user => user.active);

console.log(active);

//7.user names
const names = users.map(user => user.name);

console.log(names);

//8.sort users by descending
const sortedUsers = [...users].sort((a, b) => b.age - a.age);

console.log(sortedUsers);

