/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [{
  path: '/dashboard',
  // Relative to /src/views
  view: 'Dashboard'
},
{
  path: '/manage-user',
  name: 'Manage User',
  view: 'ManageUser'
},
{
  path: '/manage-book',
  name: 'Manage Book',
  view: 'ManageBook'
},
{
  path: '/borrow-book',
  name: 'Borrow Books',
  view: 'BookBorrow'
},
{
  path: '/manage-borrows',
  name: 'Manage Borrows',
  view: 'ManageBorrow'
},
{
  path: '/login',
  name: 'Login',
  view: 'Login'
}, {
  path: '/logout',
  name: 'Logout',
  view: 'Logout'
}
]
