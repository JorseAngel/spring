package com.example.demo;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class GreetingController {

  @RequestMapping("/greeting")
  public String greeting(Model model, @RequestParam String name) {

    model.addAttribute("name", name);

    return "greeting_template";
  }

}
