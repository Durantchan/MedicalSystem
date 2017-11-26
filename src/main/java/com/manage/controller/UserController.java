package com.manage.controller;
import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import com.manage.dao.UserDao;
import com.manage.domain.User;

import java.util.HashMap;
import java.util.Map;


/**
 * 用户控制器
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
    @ResponseBody
    public JSONObject login(@RequestParam("account") String account, @RequestParam("password") String password, HttpSession session) {
        JSONObject jsonObject = new JSONObject();
        User user = userDao.findByAccount(account);

        if (null == user || !user.getPassword().equals(password)) {
            jsonObject.put("result", "用户名和密码不匹配！");
        } else {
            session.setAttribute("account", user.getAccount());
            jsonObject.put("result", "success");
        }
        return jsonObject;
    }

    @RequestMapping(value = "/getInfo", method = RequestMethod.GET)
    @ResponseBody
    public JSONObject getInfo(HttpSession session) {
        JSONObject jsonObject = new JSONObject();
        User user = userDao.findByAccount(session.getAttribute("account").toString());
        jsonObject.put("email", user.getEmail());
        jsonObject.put("account", user.getAccount());
        return jsonObject;
    }

    @RequestMapping(value = "/modifyInfo", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject modifyInfo(@RequestParam("account") String account, @RequestParam("password") String password, @RequestParam("email") String email ) {
        JSONObject jsonObject = new JSONObject();
        Map<Object, Object> userMap = new HashMap<Object, Object>();
        userMap.put("account", account);
        userMap.put("password", password);
        userMap.put("email", email);
        userDao.updateInfo(userMap);
        jsonObject.put("result", "success");
        return jsonObject;
    }

    @GetMapping("/logout")
    public ModelAndView logout(HttpSession session){
        session.removeAttribute("account");
        return new ModelAndView("redirect:/login.html");
    }
}
