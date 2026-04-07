package com.talentbridge.util;

public class PagingUtil {
    
    public static int calculateOffset(int page, int size) {
        if (page < 1) page = 1;
        if (size < 1) size = 10;
        return (page - 1) * size;
    }
    
    public static int validateSize(int size) {
        if (size < 1) return 10;
        if (size > 100) return 100;
        return size;
    }
    
    public static int validatePage(int page) {
        return page < 1 ? 1 : page;
    }
}