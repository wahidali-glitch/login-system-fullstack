<%@ page contentType="text/html;charset=UTF-8" %>
<%@ page import="java.util.List" %>
<%@ page import="com.wahid.front_back_end.model.User" %>

<html>
<head>
    <title>All Users</title>
</head>
<body>

<h2>All Users</h2>

<table border="1">
    <tr>
        <th>ID</th>
        <th>Name</th>   <!-- 🔥 RESTORED -->
        <th>Email</th>
        <th>Actions</th>
    </tr>

    <%
        List<User> users = (List<User>) request.getAttribute("users");
        for (User u : users) {
    %>
    <tr>
        <td><%= u.getId() %></td>
        <td><%= u.getName() %></td> <!-- 🔥 RESTORED -->
        <td><%= u.getEmail() %></td>
        <td>
            <a href="edit?id=<%= u.getId() %>">Edit</a>
            <a href="delete?id=<%= u.getId() %>">Delete</a>
        </td>
    </tr>
    <% } %>

</table>

<a href="new">+ Add New User</a>

</body>
</html>