package com.bigzhao.novelreader.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by yangzhao.lyz on 2015/9/7.
 */
@Entity
@Table
public class A {

    @Id @Column
    int id;
}
