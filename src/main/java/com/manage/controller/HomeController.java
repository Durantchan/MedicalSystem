package com.manage.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;


@RestController
@RequestMapping("/")
public class HomeController {
	public Object getPortalMenus(Map<String, String> params) throws Exception{
		return null;
	}
}
