package com.manage.HandlerIntercepter;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/*
 *登陆拦截器
 * @author ronyao
 * @time 2017.11.25
 */
public class LoginHandlerIntercepter implements HandlerInterceptor{

    public boolean preHandle(HttpServletRequest request, HttpServletResponse arg1, Object o) throws Exception {

        String requestURI = request.getRequestURI();
        if(requestURI.indexOf("index.html")>0){
            //说明处在编辑的页面
            HttpSession session = request.getSession();
            String account = (String) session.getAttribute("account");
            if(account!=null){
                //登陆成功的用户
                return true;
            }else{
                //没有登陆，转向登陆界面
                request.getRequestDispatcher("/login.html").forward(request,arg1);
                return false;
            }
        }else{
            return true;
        }
    }


    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {

    }

    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {

    }
}
