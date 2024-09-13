package com.chatIdeas.chatServer.Controller;

import com.chatIdeas.chatServer.Entity.UserDetails;
import com.chatIdeas.chatServer.Repository.Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("/api")
public class UserController {
    @Autowired
    private Repo repo;
@PostMapping("/save")
    public String saveUser(@RequestBody UserDetails user){

        repo.save(user);


    return "User Saved Successfully";

}

@GetMapping("/getData")

    public List<UserDetails>getDetails(){
    return repo.findAll();

}


}
