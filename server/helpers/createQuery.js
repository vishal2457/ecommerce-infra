
let today = new Date();

const getWhereCondition = (where = []) => {
    let condition = ' 1=1';
    if (where) {
        for (var chk in where) {
            let sArr = chk.split(" ");
            if (sArr.length == 1) {
                condition += ' and ' + chk + ' = ' + where[chk];
            }
            else {
                condition += ' and ' + chk + where[chk];
            }
        }
        return condition;
    }
}

const getData = (tbl_name, where = [], selectedFields = [], joins = [], orderBy = '', limit = 0, group_by = '', having = []) => {
   
        let condition = ' 1=1';
        let condition_having = '';

        let fields = '*';
        let join_tbl = '';
        if (selectedFields && selectedFields.length > 0) {
            fields = selectedFields.join(',');
        }
        if (where) {
            for (var chk in where) {
                let sArr = chk.split(" ");
                if (sArr.length == 1) {
                    condition += ' and ' + chk + ' = ' + where[chk];
                }
                else {
                    condition += ' and ' + chk + where[chk];
                }
            }
        }
        if (having) {
            for (var chk in having) {
                let sArr = chk.split(" ");
                if (sArr.length == 1) {
                    if (condition_having) {
                        condition_having += ' and '
                    }
                    condition_having += chk + ' = ' + having[chk];
                } else {
                    if (condition_having) {
                        condition_having += ' and '
                    }
                    condition_having += chk + having[chk];
                }
            }
        }
        if (joins) {
            for (var jnt in joins) {
                if (joins[jnt].type) {
                    if (typeof joins[jnt] == 'object') {
                        join_tbl += ' ' + joins[jnt].type + ' join  ' + jnt + ' on ' + joins[jnt].joinCondition
                    }
                    else if (joins[jnt].split(',').length > 1) {
                        join_tbl += ' ' + joins[jnt].type + ' join  ' + jnt + ' on ' + joins[jnt].split(',')[1] + ' = ' + jnt + '.' + joins[jnt].split(',')[0];
                    }
                    else {
                        join_tbl += ' ' + joins[jnt].type + ' join  ' + jnt + ' on ' + tbl_name + '.' + joins[jnt] + ' = ' + jnt + '.ID';
                    }
                } else {
                    if (typeof joins[jnt] == 'object') {
                        join_tbl += ' left join  ' + jnt + ' on ' + joins[jnt].joinCondition
                    }
                    else if (joins[jnt].split(',').length > 1) {
                        join_tbl += ' left join  ' + '.' + jnt + ' on ' + joins[jnt].split(',')[1] + ' = ' + jnt + '.' + joins[jnt].split(',')[0];
                    }
                    else {
                        join_tbl += ' left join  ' + '.' + jnt + ' on [' + mssqlDb.mssqlDb.databaseName + ']' + tbl_name + '.' + joins[jnt] + ' = ' + jnt + '.ID';
                    }
                }

            }
        }
        //let qry = 'USE [' + mssqlDb.mssqlDb.databaseName + '] ';
        qry = "SET QUOTED_IDENTIFIER OFF ";
        qry += "SELECT  " + fields + " FROM "+ tbl_name + " " + join_tbl + " WHERE " + condition;

        if (group_by) {
            qry += ' GROUP BY  ' + group_by;
        }
        if (condition_having) {
            qry += ' HAVING ' + condition_having;
        }
        if (orderBy) {
            qry += ' ORDER BY ' + orderBy;
        }
        if (limit) {
            qry += ' LIMIT  ' + limit;
        }
        
        return qry;

}

const getDataWithPagination = (tbl_name, where = [], selectedFields = [], joins = [], orderBy = '', limit = 0, offset = 0, group_by = '', having = []) => {
 
        let condition = ' 1=1';
        let condition_having = '';
        let fields = '*';
        let join_tbl = '';
        if (selectedFields && selectedFields.length > 0) {
            fields = selectedFields.join(',');
        }
        if (where) {
            for (var chk in where) {
                let sArr = chk.split(" ");
                if (sArr.length == 1) {
                    condition += ' and ' + chk + ' = ' + where[chk];
                }
                else {
                    condition += ' and ' + chk + where[chk];
                }
            }
        }
        if (having) {
            for (var chk in having) {
                let sArr = chk.split(" ");
                if (sArr.length == 1) {
                    if (condition_having) {
                        condition_having += ' and '
                    }
                    condition_having += chk + ' = ' + having[chk];
                } else {
                    if (condition_having) {
                        condition_having += ' and '
                    }
                    condition_having += chk + having[chk];
                }
            }
        }
        if (joins) {
            for (var jnt in joins) {                
                if (joins[jnt].type) {
                    if (typeof joins[jnt] == 'object') {
                        join_tbl += ' ' + joins[jnt].type + ' join  ' + jnt + ' on ' + joins[jnt].joinCondition
                    }
                    else if (joins[jnt].split(',').length > 1) {
                        join_tbl += ' ' + joins[jnt].type + ' join  ' + jnt + ' on ' + joins[jnt].split(',')[1] + ' = ' + jnt + '.' + joins[jnt].split(',')[0];
                    }
                    else {
                        join_tbl += ' ' + joins[jnt].type + ' join  ' + jnt + ' on ' + tbl_name + '.' + joins[jnt] + ' = ' + jnt + '.ID';
                    }
                } else {
                    if (typeof joins[jnt] == 'object') {
                        join_tbl += ' left join  ' + jnt + ' on ' + joins[jnt].joinCondition
                    }
                    else if (joins[jnt].split(',').length > 1) {
                        join_tbl += ' left join  ' + jnt + ' on ' + joins[jnt].split(',')[1] + ' = ' + jnt + '.' + joins[jnt].split(',')[0];
                    }
                    else {
                        join_tbl += ' left join  ' + jnt + ' on ' + tbl_name + '.' + joins[jnt] + ' = ' + jnt + '.ID';
                    }
                }

            }
        }
        
        let qry_count = '';
        if (group_by) {
            qry_count = "(SELECT COUNT(*) FROM (SELECT COUNT(*)," + fields + " FROM " + tbl_name + " " + join_tbl + " WHERE " + condition + " GROUP BY " + group_by + " HAVING " + condition_having + " ) as subTable)";
        } else {
            qry_count = "(SELECT COUNT(*) FROM " + tbl_name + " " + join_tbl + " WHERE " + condition + ")";
        }

        let qry = "";

        qry = "SELECT  " + fields + "," + qry_count + " as TotalCount FROM " + tbl_name + " " + join_tbl + " WHERE " + condition;
        if (group_by) {
            qry += ' GROUP BY  ' + group_by;
        }

        if (orderBy) {
            qry += ' ORDER BY ' + orderBy;
        } else {
            if (tbl_name != '[' + mssqlDb.mssqlDb.databaseName + '].[dbo].[Purchase_Requisition_Detail]') {
                qry += ' ORDER BY ' + tbl_name + ".ID DESC";
            }

        }
        if (limit && (offset || offset == 0 )) {
            qry += ' LIMIT ' + offset + ", " + limit;
        }
        
        return qry;
        

}
const getDataById = (id, tbl_name, selectedFields = [], joins = []) => {
   
        responseObj = {};
        fields = '*';
        let join_tbl = '';
        if (selectedFields && selectedFields.length > 0) {
            fields = selectedFields.join(',');
        }

        if (joins) {
            for (var jnt in joins) {
                if (typeof joins[jnt] == 'object') {
                    join_tbl += ' left join  ' + jnt + ' on ' + joins[jnt].joinCondition
                }
                else if (joins[jnt].split(',').length > 1) {
                    join_tbl += ' left join  ' + jnt + ' on ' + joins[jnt].split(',')[1] + ' = ' + jnt + '.' + joins[jnt].split(',')[0];
                }
                else {
                    join_tbl += ' left join  ' + jnt + ' on ' + tbl_name + '.' + joins[jnt] + ' = ' + jnt + '.ID';
                }
            }
        }
        return "select " + fields + " FROM " + tbl_name + " " + join_tbl + " WHERE " + tbl_name + ".ID = " + id;
             
   
}


module.exports = {
    getWhereCondition,
    getData,
    getDataWithPagination,
    getDataById,
}