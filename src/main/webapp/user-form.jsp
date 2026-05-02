<%@ page contentType="text/html;charset=UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<html>
<head>
    <title>User Form</title>
</head>
<body>

<center>
    <h1>User Management</h1>

    <h2>
        <c:choose>
            <c:when test="${user != null}">
                Edit User
            </c:when>
            <c:otherwise>
                Add New User
            </c:otherwise>
        </c:choose>
    </h2>
</center>

<div align="center">

    <!-- 🔥 ERROR MESSAGE -->
    <c:if test="${not empty error}">
        <p style="color:red;">${error}</p>
    </c:if>

    <!-- 🔥 FORM -->
    <form action="<c:choose>
                    <c:when test='${user != null}'>update</c:when>
                    <c:otherwise>insert</c:otherwise>
                 </c:choose>" method="post">

        <!-- ID (for update) -->
        <c:if test="${user != null}">
            <input type="hidden" name="id" value="${user.id}" />
        </c:if>

        <table border="1" cellpadding="8">

            <tr>
                <th>Name:</th>
                <td>
                    <input type="text" name="name"
                           value="${user.name}" required />
                </td>
            </tr>

            <tr>
                <th>Email:</th>
                <td>
                    <input type="email" name="email"
                           value="${user.email}" required />
                </td>
            </tr>

            <tr>
                <th>Password:</th>
                <td>
                    <input type="password" name="password"
                           placeholder="Enter new password" />
                </td>
            </tr>

            <tr>
                <td colspan="2" align="center">
                    <input type="submit" value="Save" />
                </td>
            </tr>

        </table>
    </form>

    <br>
    <a href="users">⬅ Back to List</a>

</div>

</body>
</html>