/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("document.addEventListener('DOMContentLoaded', function () {\n  fetchUsers();\n\n  // Add User\n  document.getElementById('addUserForm').addEventListener('submit', function (event) {\n    event.preventDefault();\n    var name = document.getElementById('name').value;\n    var email = document.getElementById('email').value;\n    var role = document.getElementById('role').value;\n    fetch('/api/users', {\n      method: 'POST',\n      headers: {\n        'Content-Type': 'application/json'\n      },\n      body: JSON.stringify({\n        name: name,\n        email: email,\n        role: role\n      })\n    }).then(function (response) {\n      return response.json();\n    }).then(function (data) {\n      console.log('Success:', data);\n      fetchUsers(); // Refresh the user list\n    })[\"catch\"](function (error) {\n      console.error('Error:', error);\n    });\n  });\n\n  // Event delegation for Edit and Delete\n  document.getElementById('userList').addEventListener('click', function (event) {\n    if (event.target.classList.contains('edit')) {\n      var userId = event.target.getAttribute('data-id');\n      var name = prompt('Enter new name:');\n      var email = prompt('Enter new email:');\n      var role = prompt('Enter new role (User/Admin):');\n      if (name && email && role) {\n        fetch(\"/api/users/\".concat(userId), {\n          method: 'PUT',\n          headers: {\n            'Content-Type': 'application/json'\n          },\n          body: JSON.stringify({\n            name: name,\n            email: email,\n            role: role\n          })\n        }).then(function (response) {\n          return response.json();\n        }).then(function (data) {\n          console.log('Updated:', data);\n          fetchUsers(); // Refresh the user list\n        })[\"catch\"](function (error) {\n          console.error('Error:', error);\n        });\n      }\n    }\n    if (event.target.classList.contains('delete')) {\n      var _userId = event.target.getAttribute('data-id');\n      if (confirm('Are you sure you want to delete this user?')) {\n        fetch(\"/api/users/\".concat(_userId), {\n          method: 'DELETE'\n        }).then(function (response) {\n          return response.json();\n        }).then(function (data) {\n          console.log('Deleted:', data);\n          fetchUsers(); // Refresh the user list\n        })[\"catch\"](function (error) {\n          console.error('Error:', error);\n        });\n      }\n    }\n  });\n});\n\n// Fetch and display users\nfunction fetchUsers() {\n  fetch('/api/users').then(function (response) {\n    return response.json();\n  }).then(function (users) {\n    var userList = document.getElementById('userList');\n    userList.innerHTML = '';\n    users.forEach(function (user) {\n      var li = document.createElement('li');\n      li.innerHTML = \"\\n          \".concat(user.name, \" (\").concat(user.email, \") - \").concat(user.role, \"\\n          <button class=\\\"edit\\\" data-id=\\\"\").concat(user.id, \"\\\">Edit</button>\\n          <button class=\\\"delete\\\" data-id=\\\"\").concat(user.id, \"\\\">Delete</button>\\n        \");\n      userList.appendChild(li);\n    });\n  })[\"catch\"](function (error) {\n    console.error('Error fetching users:', error);\n  });\n}\n\n//# sourceURL=webpack://client/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;