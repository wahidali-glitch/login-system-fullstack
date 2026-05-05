package com.wahid.front_back_end.web;

import jakarta.servlet.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;

import com.wahid.front_back_end.dao.UserDao;
import com.wahid.front_back_end.model.User;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private UserDao dao;

    @Override
    public void init() {
        dao = new UserDao();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String email    = req.getParameter("email");
        String password = req.getParameter("password");

        // Basic validation
        if (email == null || email.isEmpty() ||
                password == null || password.isEmpty()) {
            // Return plain-text error — JS strips HTML tags anyway
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.setContentType("text/plain");
            resp.getWriter().write("Email and password are required.");
            return;
        }

        User user = dao.getUser(email, password); // BCrypt check happens in DAO

        if (user != null) {
            HttpSession session = req.getSession();
            session.setAttribute("users", user);
            // Redirect to dashboard — JS detects res.redirected + URL contains dashboard.html
            resp.sendRedirect("dashboard.html");
        } else {
            // ✅ FIX: return 401 plain-text instead of forwarding to missing login.jsp
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.setContentType("text/plain");
            resp.getWriter().write("Invalid email or password.");
        }
    }
}