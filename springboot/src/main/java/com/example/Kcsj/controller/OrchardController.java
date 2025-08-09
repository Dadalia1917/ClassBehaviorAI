package com.example.Kcsj.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.Kcsj.common.Result;
import com.example.Kcsj.entity.Orchard;
import com.example.Kcsj.mapper.OrchardMapper;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Date;

@RestController
@RequestMapping("/orchard")
public class OrchardController {
    @Resource
    OrchardMapper orchardMapper;

    @GetMapping("/all")
    public Result<?> GetAll() {
        return Result.success(orchardMapper.selectList(null));
    }
    
    @GetMapping("/{id}")
    public Result<?> getById(@PathVariable int id) {
        System.out.println(id);
        return Result.success(orchardMapper.selectById(id));
    }

    @GetMapping
    public Result<?> findPage(@RequestParam(defaultValue = "1") Integer pageNum,
                              @RequestParam(defaultValue = "10") Integer pageSize,
                              @RequestParam(defaultValue = "") String search,
                              @RequestParam(defaultValue = "") String search1,
                              @RequestParam(defaultValue = "") String search3,
                              @RequestParam(defaultValue = "") String search2) {
        LambdaQueryWrapper<Orchard> wrapper = Wrappers.<Orchard>lambdaQuery();
        wrapper.orderByDesc(Orchard::getId);
        if (StrUtil.isNotBlank(search)) {
            wrapper.like(Orchard::getUsername, search);
        }
        if (StrUtil.isNotBlank(search1)) {
            wrapper.like(Orchard::getArea, search1);
        }
        if (StrUtil.isNotBlank(search2)) {
            wrapper.like(Orchard::getTime, search2);
        }
        Page<Orchard> Page = orchardMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);
        return Result.success(Page);
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(@PathVariable int id) {
        orchardMapper.deleteById(id);
        return Result.success();
    }

    @PostMapping("/update")
    public Result<?> updates(@RequestBody Orchard orchard) {
        orchardMapper.updateById(orchard);
        return Result.success();
    }


    @PostMapping
    public Result<?> save(@RequestBody Orchard orchard) {
        System.out.println(orchard);
        orchard.setTime(new Date());
        orchardMapper.insert(orchard);
        return Result.success();
    }
}
