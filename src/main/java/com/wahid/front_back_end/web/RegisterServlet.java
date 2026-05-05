package com.wahid.front_back_end.web;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

import com.wahid.front_back_end.dao.UserDao;
import com.wahid.front_back_end.model.User;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        // ======== GET PARAMETERS ========
        String name            = req.getParameter("name");
        String email           = req.getParameter("email");
        String password        = req.getParameter("password");
        String confirmPassword = req.getParameter("confirmPassword");

        // ======== BASIC VALIDATION ========
        if (name == null || email == null || password == null ||
                name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.setContentType("text/plain");
            resp.getWriter().write("All fields are required!");
            return;
        }

        if (!password.equals(confirmPassword)) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.setContentType("text/plain");
            resp.getWriter().write("Passwords do not match!");
            return;
        }

        // ======== DAO OBJECT ========
        UserDao dao = new UserDao();

        // ======== CHECK DUPLICATE EMAIL ========
        if (dao.emailExists(email)) {
            resp.setStatus(HttpServletResponse.SC_CONFLICT);
            resp.setContentType("text/plain");
            resp.getWriter().write("Email already registered!");
            return;
        }

        // ======== CREATE USER OBJECT ========
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);

        // ======== SAVE USER ========
        boolean isSaved = dao.saveUser(user);

        // ======== RESPONSE ========
        if (isSaved) {
            // ✅ FIX: redirect to register-success so JS detects res.redirected
            //    and the URL is DIFFERENT from index.html (avoids page reload wiping the toast)
            resp.sendRedirect("register-success");
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.setContentType("text/plain");
            resp.getWriter().write("Registration failed. Please try again.");
        }
    }
}