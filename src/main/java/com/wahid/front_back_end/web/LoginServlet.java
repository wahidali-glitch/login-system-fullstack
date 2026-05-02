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
        dao = new UserDao(); // ✅ created once
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String email = req.getParameter("email");
        String password = req.getParameter("password");

        // Basic validation
        if (email == null || email.isEmpty() ||
                password == null || password.isEmpty()) {

            req.setAttribute("error", "Email and password are required");
            req.getRequestDispatcher("login.jsp").forward(req, resp);
            return;
        }

        User user = dao.getUser(email, password); // BCrypt check happens in DAO

        if (user != null) {
            HttpSession session = req.getSession();
            session.setAttribute("users", user);

            resp.sendRedirect("dashboard.html");
        } else {
            req.setAttribute("error", "Invalid email or password");
            req.getRequestDispatcher("login.jsp").forward(req, resp);
        }
    }
}