package com.manage.controller;
import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.manage.dao.UserDao;
import com.manage.domain.User;



/**
 * ÓÃ»§¿ØÖÆÆ÷
 */
@Controller
@RequestMapping(value = "/user")
public class UserController {
    @Resource
    private UserDao userDao;

    @RequestMapping("/view")
    public String view() {
        return "main/login";
    }

    @RequestMapping("/indexview")
    public String index() {
        return "main/index";
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public ModelAndView login(User model, HttpSession session) {
        User user = userDao.findByAccount(model.getAccount());

        if (null == user || !user.getPassword().equals(model.getPassword())) {
            return new ModelAndView("redirect:/login.html");
        } else {
            session.setAttribute("account", user.getAccount());
            return new ModelAndView("redirect:/index.html");
        }
    }

    @GetMapping("logout")
    public String logout(HttpSession session){
        session.removeAttribute("account");
        return "login";
    }
}
