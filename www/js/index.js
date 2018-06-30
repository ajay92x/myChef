/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var GLOBAL = {
    baseUrl: 'http://202.157.171.134/~smsinvestigation/wlc/public/api/v1/',
    prefix: 'merchant/'
}
var image = [];
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    appendImage: function (type, element, source) {
        console.log(type, element, source);

        //        var base64Img = 'data:image/jpeg;base64,' + source;
        var base64Img = source;
        var hspace = 7;

        if (type == 'photo') {
            $(element).attr('src', base64Img);
            $(element).attr('changed', '1');
        } else if (type == 'create_package') {
            var appendElement = `<img new="1" vspace="10" hspace="${hspace}" src="${base64Img}">`;
            $(element).append(appendElement);

            if ($(element).find('img').length < 5) {
                $('#selectMultipleImage').show();
            } else {
                $('#selectMultipleImage').hide();
            }
        }
    },
    imagePicker: function (buttonIndex, type, element) {
        if (buttonIndex == 1) {
            navigator.camera.getPicture(function (source) {
                console.log('success', source);
                plugins.crop(function success(data) {
                        app.imageBase64(data, function (base64Img) {
                            app.appendImage(type, element, base64Img);
                        });
                    },
                    function fail(failure) {
                        app.onAlert('Failed because: ' + failure);
                    }, source, {
                        quality: 100
                    });
            }, function (failure) {
                console.log('failure', failure);
                app.onAlert('Failed because: ' + failure);
            }, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });
        } else if (buttonIndex == 2) {
            navigator.camera.getPicture(function (source) {
                console.log('success', source);
                plugins.crop(function success(data) {
                        app.imageBase64(data, function (base64Img) {
                            app.appendImage(type, element, base64Img);
                        });
                    },
                    function fail(failure) {
                        app.onAlert('Failed because: ' + failure);
                    }, source, {
                        quality: 100
                    });
            }, function (failure) {
                console.log('failure', failure);
                app.onAlert('Failed because: ' + failure);
            }, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            });
        }
    },
    actionSheet: function (type, msg, title, buttonOneName, buttonTwoName, element) {

        var callback = function (buttonIndex) {
            setTimeout(function () {
                console.log('button index clicked: ' + buttonIndex);
                app.imagePicker(buttonIndex, type, element);
            });
        };
        var options = {
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT, // material
            title: msg ? msg : '',
            subtitle: '', // supported on iOS only
            buttonLabels: ['Take photo', 'Gallery'],
            addCancelButtonWithLabel: '',
            androidEnableCancelButton: true,
            winphoneEnableCancelButton: true,
            addDestructiveButtonWithLabel: '',
            destructiveButtonLast: true // you can choose where the destructive button is shown
        };
        window.plugins.actionsheet.show(options, callback);
    },
    onAlert: function (msg, buttonName) {
        function alertDismissed() {
            // do something
        }

        console.log(msg);
        try {
            navigator.notification.alert(
                msg ? msg : 'You are the winner!', // message
                alertDismissed, // callback
                '', // title
                buttonName ? buttonName : 'Ok' // buttonName
            );
        } catch (err) {}
    },
    onConfirm: function (type, msg, title, buttonOneName, buttonTwoName, element) {
        function onConfirm(buttonIndex) {
            console.log('You selected button ' + buttonIndex);
            if (type == 'photo' || type == 'create_package') {
                app.imagePicker(buttonIndex, type, element);
            } else if (type == 'delete') {
                var item_id = $('.delMenu').data('id');
                if (buttonIndex == 1) {
                    app.deleteItem(item_id);
                }
            }
        }

        console.log(msg);
        try {
            navigator.notification.confirm(
                msg ? msg : '', // message
                onConfirm, // callback to invoke with index of button pressed
                title ? title : '', // title
                [buttonOneName, buttonTwoName] // buttonLabels
            );
        } catch (err) {}
    },
    onToast: function (msg) {
        window.plugins.toast.show(msg ? msg : 'Hello there!', 'long', 'bottom', function (a) {
            console.log('toast success: ' + a);
        }, function (b) {
            console.log('toast error: ' + b);
        });
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        FCMPlugin.getToken(function (token) {
            localStorage.setItem('fcm_token', token);
        });
        FCMPlugin.onNotification(function (data) {
            if (data.wasTapped) {
                //Notification was received on device tray and tapped by the user.
                console.log(JSON.stringify(data));
            } else {
                //Notification was received in foreground. Maybe the user needs to be notified.
                console.log(JSON.stringify(data));
            }
        });
        this.receivedEvent('deviceready');
        var $this = this;

        // setInterval(function(){
        //     if(location.pathname == '/dashboard.html')
        //         location.reload();
        // }, 10000);

        $('.btn_login').on('click', function () {
            $this.loginMethod();
        });

        $('.btn-forgot').on('click', function () {
            $this.forgotMethod();
        });

        $('.btn-verify').on('click', function () {
            $this.otpMethod();
        });

        $('.btn-change').on('click', function () {
            $this.changePassword();
        });


        $('.click_logout').on('click', function () {
            $this.logout();
        });

        $(document).on('blur', 'input[name=price]', function () {
            var num = parseFloat($(this).val());
            var cleanNum = num.toFixed(2);
            $(this).val(cleanNum);
        });

        //update Profile
        $(document).on('click', '.update_profile', function () {
            $this.updateProfile();
        });

        //add Package
        $(document).on('click', '.add_package', function () {
            $this.savePackage();
        });
        $(document).on('click', '.update_package', function () {
            $this.updatePackage();
        });

        //add Item
        $(document).on('click', '.add_item', function () {
            $this.saveItem();
        });
        $(document).on('click', '.update_item', function () {
            $this.updateItem();
        });

        //accept order
        $(document).on('click', '.accept_order', function () {
            var item_id = $(this).attr('item-id');
            $this.acceptOrder(item_id);
        });

        // process the confirmation dialog result
        function onConfirm(button) {
            var item_id = $('.delMenu').data('id');
            if (button == 1) {
                $this.deleteItem(item_id);
            }
        }

        // Show a custom confirmation dialog
        //
        function showConfirm() {
            navigator.notification.confirm(
                'Are you sure about deleting this item', // message
                onConfirm // callback to invoke with index of button pressed
                // 'Game Over',            // title
                // 'Restart,Exit'          // buttonLabels
            );
        }
        //delete item/package
        $(document).on('click', '.delMenu', function () {
            // var item_id = $(this).data('id');
            // confirm("Are you sure about deleting this item");
            //            showConfirm();
            app.onConfirm('delete', 'Are you sure you want to delete this item?', '', 'Yes', 'No', '')
        });
        //take picture
        function onFail(message) {
            app.onAlert('Failed because: ' + message);
        }

        function cameraSuccessClick(imageData) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
            $('#myImage').attr('changed', '1');
        }

        function getFileContentAsBase64(path, callback) {
            window.resolveLocalFileSystemURL(path, gotFile, fail);

            function fail(e) {
                app.onAlert('Cannot found requested file');
            }

            function gotFile(fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function (e) {
                        var content = this.result;
                        callback(content);
                    };
                    // The most important point, use the readAsDatURL Method from the file plugin
                    reader.readAsDataURL(file);
                });
            }
        }

        function cameraSuccess(imageData, image_id) {
            console.log(imageData);

            var image = document.getElementById('myImage_' + image_id);
            image.src = "data:image/jpeg;base64," + imageData;
            $('#myImage_' + image_id).attr('changed', '1');

            //             plugins.crop(function success (d) {
            //                 var image = document.getElementById('myImage_'+image_id);
            //                 // var b;
            //                 getFileContentAsBase64(d,function(base64Image){
            //                       // b = base64Image;
            //                       localStorage.setItem('base64', base64Image);
            //                 });
            //                 // console.log(b);
            // // console.log(localStorage.getItem('base64'));
            //                 image.src = localStorage.getItem('base64');//"data:image/jpeg;base64," + imageData;
            //                 $('#myImage_'+image_id).attr('changed', '1');
            //             }, function fail () {
            //
            //             }, imageData, { quality: 100, targetWidth: 200, targetHeight: 200 });
        }

        $(document).on('click', '.take_picture', function () {
            navigator.camera.getPicture(cameraSuccessClick, onFail, {
                destinationType: Camera.DestinationType.DATA_URL
            });
        });

        $(document).on('click', '.select_picture', function () {
            var image_id = $(this).data('image-id');
            navigator.camera.getPicture(function (imageData) {
                return cameraSuccess(imageData, image_id);
            }, onFail, {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true
            });
        });

        $(document).on('click', '.add-more', function () {
            var image_id = parseInt($('.add-more').data('id'));
            image_id += 1;
            $('.add-more').data('id', image_id);
            var html = '<div class="select_picture" data-image-id="' + image_id + '">' +
                '<img id="myImage_' + image_id + '" style="width: 100px; height: 100px;" src="images/img-placeholder.png" alt="">' +
                '</div>';
            $('.image_area').append(html);
        });


        //
        $(document).on('change', '#Vegetarian', function () {
            $('#Halal').prop('checked', false);
        });
        $(document).on('change', '#Halal', function () {
            $('#Vegetarian').prop('checked', false);
        });

        //
        // $(document).on('click', '.click_inapp', function(){
        //     var token = $.parseJSON(localStorage.getItem('user_data')).token;
        //     var ref = cordova.InAppBrowser.open('http://202.157.171.134/~smsinvestigation/wlc/public/customer/dashboard?token='+token, '_system', 'location=no');
        //     console.log(ref);
        // });

    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        checkConnection();
        // window.open = cordova.InAppBrowser.open;
        // window.alert = navigator.notification.alert;

        var permissions = cordova.plugins.permissions;
        var list = [
          permissions.CAMERA,
          permissions.ACCESS_COARSE_LOCATION
        ];

        permissions.checkPermission(list, error, null);

        function error() {
            console.warn('Camera permission is not turned on');
        }

        function success(status) {
            if (!status.checkPermission) {

                permissions.requestPermissions(
                    list,
                    function (status) {
                        if (!status.checkPermission) error();
                    },
                    error);
            }
        }

        function checkConnection() {
            var networkState = navigator.connection.type;

            var states = {};
            states[Connection.UNKNOWN] = 'Unknown connection';
            states[Connection.ETHERNET] = 'Ethernet connection';
            states[Connection.WIFI] = 'WiFi connection';
            states[Connection.CELL_2G] = 'Cell 2G connection';
            states[Connection.CELL_3G] = 'Cell 3G connection';
            states[Connection.CELL_4G] = 'Cell 4G connection';
            states[Connection.CELL] = 'Cell generic connection';
            states[Connection.NONE] = 'No network connection';

            if (networkState == Connection.NONE) {
                app.onAlert(states[networkState]);
            }
        }

        document.addEventListener("offline", checkConnection, false);

    },

    loginMethod: function () {

        var username = $('input[name="username"]').val();
        var remember_me = $('input[name="remember_me"]:checked').val();
        if (username == '') {
            app.onToast('Please enter username.');
            return false;
        }
        var password = $('input[name="password"]').val();
        if (password == '') {
            app.onToast('Please enter password.');
            return false;
        }
        var fcm_token = localStorage.getItem('fcm_token');
        var formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('fcm_token', fcm_token);
        formData.append('type', 'merchant');

        $.ajax({
            type: 'POST',
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'login',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            success: function (data) {
                console.log(data);
                var obj = data;
                if (obj.status == 'success') {
                    var user_id = obj.data.token;
                    localStorage.setItem('user_id', user_id);
                    localStorage.setItem('user_data', JSON.stringify(obj.data));
                    var uCreds = [];
                    uCreds.push(username);
                    uCreds.push(password);

                    localStorage.setItem('userCredentials', uCreds);
                    if (remember_me == 1) {
                        localStorage.setItem('username_rem', username);
                        localStorage.setItem('password_rem', password);
                    }
                    window.location.href = 'dashboard.html';

                } else if (obj.status == 'error') {
                    if (obj.message == 'VALIDATION_ERROR') {
                        if (obj.data.username) {
                            app.onAlert(obj.data.username);
                        }
                        if (obj.data.password) {
                            app.onAlert(obj.data.password);
                        }
                    } else if (obj.message == 'INVALID_CREDENTIALS') {
                        app.onAlert("Either username or password is wrong.");
                    } else {
                        app.onAlert(obj.message);
                    }
                }
            },
            error: function (jqXmlHttpRequest, textStatus, errorThrown) {
                app.onAlert(textStatus);
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            }
        });
        //return false;
    },

    forgotMethod: function () {

        var email = $('input[name="email"]').val();
        if (email == '') {
            app.onToast('Please enter email.');
            return false;
        }
        var formData = new FormData();
        formData.append('email', email);

        $.ajax({
            type: 'POST',
            url: GLOBAL.baseUrl + 'forgot/password',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            success: function (data) {
                console.log(data);
                var obj = data;
                if (obj.error == "false") {
                    app.onAlert(obj.message);
                    $('.otp').removeClass('hide');
                    $('.email').addClass('hide');
                } else if (obj.error == "true") {
                    console.log(obj.message);
                    if (obj.message != '') {
                        if (obj.message.email) {
                            app.onAlert(obj.message.email);
                        }
                    } else {
                        app.onAlert(obj.message);
                    }
                }
            },
            error: function (jqXmlHttpRequest, textStatus, errorThrown) {

                if (jqXmlHttpRequest.responseJSON.error == 'true') {
                    if (jqXmlHttpRequest.responseJSON.message.email != undefined)
                        app.onAlert(jqXmlHttpRequest.responseJSON.message.email);
                    else {
                        app.onAlert(textStatus);
                    }
                } else {
                    app.onAlert(textStatus);
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            }
        });
        //return false;
    },

    otpMethod: function () {

        var otp = $('input[name="otp"]').val();

        var formData = new FormData();
        formData.append('otp', otp);

        $.ajax({
            type: 'POST',
            url: GLOBAL.baseUrl + 'forgot/password/otp',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            success: function (data) {
                console.log(data);
                var obj = data;

                if (obj.error == "false") {
                    localStorage.setItem('otp_id', obj.id);
                    window.location.href = "change_password.html";
                } else if (obj.error == "true") {
                    app.onAlert(obj.message);
                }
            },
            error: function (jqXmlHttpRequest, textStatus, errorThrown) {
                app.onAlert(textStatus);
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            }
        });
        //return false;
    },

    changePassword: function () {

        var password = $('input[name="password"]').val();
        var con_pass = $('input[name="con_pass"]').val();
        if (password != con_pass) {
            app.onToast("Password does not match");
            return false;
        }
        var id = localStorage.getItem('otp_id');
        var formData = new FormData();
        formData.append('id', id);
        formData.append('password', password);


        $.ajax({
            type: 'POST',
            url: GLOBAL.baseUrl + 'forgot/password/update',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            success: function (data) {
                console.log(data);
                var obj = data;
                if (obj.error == "false") {
                    localStorage.setItem('otp_id', '');
                    app.onToast("Password has been updated.");
                    window.location.href = "index.html";
                } else if (obj.error == "true") {
                    app.onAlert(obj.message);
                }

            },
            error: function (jqXmlHttpRequest, textStatus, errorThrown) {
                app.onAlert(textStatus);
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            }
        });
        //return false;
    },

    getDashboard: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'dashboard',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data.orders;
                    var porders = obj.data.orders_p;
                    var morning = obj.data.morning;
                    var pickup_time = obj.data.pickup_time;

                    var html = "";
                    // if(orders.length && porders.length){
                    for (var i = 0; i < orders.length; i++) {
                        var id, batch_id, qty, status_id;
                        id = orders[i].id;
                        batch_id = orders[i].batch_id;
                        qty = orders[i].item_count;
                        status_id = orders[i].status_id;
                        accepted = orders[i].accepted;

                        html += '<div class="list-bg">' +
                            '<ul>' +
                            '<li>' +
                            '<label><strong>Batch Id</strong></label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">' + batch_id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Order Id</label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">#' + id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Pickup Time</label>' +
                            '<span>: ' + pickup_time + '</span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Total Items</label>' +
                            '<span>: ' + qty + '</span>' +
                            '</li>' +

                            '</ul>';
                        // '<span class="totel-qty">Total Qty : '+qty+'</span>';
                        if (accepted == 0) {
                            html += '<a class="btn-status accept_order" item-id="' + id + '">Accept</a>';
                        } else {
                            if (status_id < 9) {
                                html += '<a class="btn-status" item-id="' + id + '" data-toggle="modal" data-target="#myModal">Update Status</a>';
                            } else {
                                html += '<a class="btn-status active" href="javascript:;">Ready For Pick up</a>';
                            }

                        }
                        html += '</div>';
                    }

                    for (var i = 0; i < porders.length; i++) {
                        var id, batch_id, qty, status_id;
                        id = porders[i].id;
                        batch_id = porders[i].batch_id;
                        qty = porders[i].item_count;
                        status_id = porders[i].status_id;
                        accepted = porders[i].accepted;

                        html += '<div class="list-bg">' +
                            '<ul>' +
                            '<li>' +
                            '<label><strong>Batch Id</strong></label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">' + batch_id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Order Id</label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">#' + id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Pickup Time</label>' +
                            '<span>: ' + pickup_time + '</span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Total Items</label>' +
                            '<span>: ' + qty + '</span>' +
                            '</li>' +

                            '</ul>';
                        // '<span class="totel-qty">Total Qty : '+qty+'</span>';
                        if (accepted == 0) {
                            html += '<a class="btn-status accept_order" item-id="' + id + '">Accept</a>';
                        } else {
                            if (status_id < 9) {
                                html += '<a class="btn-status" item-id="' + id + '" data-toggle="modal" data-target="#myModal">Update Status</a>';
                            } else {
                                html += '<a class="btn-status active" href="javascript:;">Ready For Pick up</a>';
                            }
                        }
                        html += '</div>';
                    }

                    // }else{
                    //     html ='<div class="list-bg">No orders for today.</div>';
                    // }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.message);
                }
            }
        });
        return false;
    },

    getNewOrders: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'orders/new',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data.orders;
                    var porders = obj.data.orders_p;

                    var html = "";
                    for (var i = 0; i < orders.length; i++) {
                        var id, batch_id, qty, status_id;
                        id = orders[i].id;
                        batch_id = orders[i].batch_id;
                        qty = orders[i].item_count;
                        status_id = orders[i].status_id;
                        var pickup_time = orders[i].pickup_time;

                        html += '<div class="list-bg">' +
                            '<ul>' +
                            '<li>' +
                            '<label><strong>Batch Id</strong></label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">' + batch_id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Order Id</label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">#' + id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Pickup Time</label>' +
                            '<span>: ' + pickup_time + '</span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Total Items</label>' +
                            '<span>: ' + qty + '</span>' +
                            '</li>' +

                            '</ul>';
                        // '<span class="totel-qty">Total Qty : '+qty+'</span>';
                        html += '<a class="btn-status accept_order" item-id="' + id + '">Accept</a>';

                        html += '</div>';
                    }

                    for (var i = 0; i < porders.length; i++) {
                        var id, batch_id, qty, status_id;
                        id = porders[i].id;
                        batch_id = porders[i].batch_id;
                        qty = porders[i].item_count;
                        status_id = porders[i].status_id;
                        var pickup_time = porders[i].pickup_time;

                        html += '<div class="list-bg">' +
                            '<ul>' +
                            '<li>' +
                            '<label><strong>Batch Id</strong></label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">' + batch_id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Order Id</label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">#' + id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Pickup Time</label>' +
                            '<span>: ' + pickup_time + '</span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Total Items</label>' +
                            '<span>: ' + qty + '</span>' +
                            '</li>' +

                            '</ul>';
                        // '<span class="totel-qty">Total Qty : '+qty+'</span>';
                        html += '<a class="btn-status accept_order" item-id="' + id + '">Accept</a>';
                        html += '</div>';
                    }

                    $('.new_listing_content').html(html);

                } else if (obj.status == 'error') {
                    app.onAlert(obj.message);
                }
            }
        });
        return false;
    },

    getUpcomingOrders: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'orders/upcoming',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data.orders;
                    var porders = obj.data.orders_p;

                    var html = "";
                    for (var i = 0; i < orders.length; i++) {
                        var id, batch_id, qty, status_id;
                        id = orders[i].id;
                        batch_id = orders[i].batch_id;
                        qty = orders[i].item_count;
                        status_id = orders[i].status_id;
                        var pickup_time = orders[i].pickup_time;

                        html += '<div class="list-bg">' +
                            '<ul>' +
                            '<li>' +
                            '<label><strong>Batch Id</strong></label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">' + batch_id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Order Id</label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">#' + id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Pickup Time</label>' +
                            '<span>: ' + pickup_time + '</span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Total Items</label>' +
                            '<span>: ' + qty + '</span>' +
                            '</li>' +

                            '</ul>';
                        // '<span class="totel-qty">Total Qty : '+qty+'</span>';
                        html += '<a class="btn-status active">Upcoming Order</a>';

                        html += '</div>';
                    }

                    for (var i = 0; i < porders.length; i++) {
                        var id, batch_id, qty, status_id;
                        id = porders[i].id;
                        batch_id = porders[i].batch_id;
                        qty = porders[i].item_count;
                        status_id = porders[i].status_id;
                        var pickup_time = porders[i].pickup_time;

                        html += '<div class="list-bg">' +
                            '<ul>' +
                            '<li>' +
                            '<label><strong>Batch Id</strong></label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">' + batch_id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Order Id</label>' +
                            '<span>: <a href="batch_detail.html?order_id=' + id + '">#' + id + '</a></span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Pickup Time</label>' +
                            '<span>: ' + pickup_time + '</span>' +
                            '</li>' +
                            '<li>' +
                            '<label>Total Items</label>' +
                            '<span>: ' + qty + '</span>' +
                            '</li>' +

                            '</ul>';
                        // '<span class="totel-qty">Total Qty : '+qty+'</span>';
                        html += '<a class="btn-status active">Upcoming Order</a>';
                        html += '</div>';
                    }

                    $('.upcoming_listing_content').html(html);

                } else if (obj.status == 'error') {
                    app.onAlert(obj.message);
                }
            }
        });
        return false;
    },

    acceptOrder: function (item_id) {

        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);
        formData.append('item_id', item_id);

        $.ajax({
            method: 'post',
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'order/accept',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            error: function (xhr) {
                console.log("Error");
                console.log(xhr);
            },
            success: function (data) {
                console.log(data);
                var obj = data;
                if (obj.status == 'success') {
                    app.onToast('Order accepted');
                    location.reload();
                } else if (obj.status == 'error') {
                    app.onAlert(obj.message);
                }

            }
        });
    },

    updateOrder: function (item_id) {

        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);
        formData.append('item_id', item_id);
        formData.append('status_id', '');

        $.ajax({
            method: 'post',
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'order/update',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            error: function (xhr) {
                console.log("Error");
                console.log(xhr);
            },
            success: function (data) {
                console.log(data);
                var obj = data;
                if (obj.status == 'success') {
                    location.reload();
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }

            }
        });
    },

    updateItemStatus: function (item_id) {

        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);
        formData.append('item_id', item_id);
        formData.append('status_id', '');

        $.ajax({
            method: 'post',
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'item/update',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            error: function (xhr) {
                console.log("Error");
                console.log(xhr);
            },
            success: function (data) {
                console.log(data);
                var obj = data;
                if (obj.status == 'success') {
                    location.reload();
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getBatch: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var url_string = window.location.href;
        var url = new URL(url_string);
        var order_id = url.searchParams.get("order_id");

        var formData = new FormData();
        formData.append('token', token);
        formData.append('order_id', order_id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'order/view',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data;
                    var html = "";
                    for (var i = 0; i < orders.length; i++) {
                        var item_id, batch_id, qty, status_id, item_name;
                        item_id = orders[i].id;
                        item_name = orders[i].item_name;
                        restaurant_status_id = orders[i].restaurant_status_id;
                        qty = orders[i].quantity;
                        restaurant_status_name = orders[i].restaurant_status_name;

                        html += '<div class="list-bg" item-id="' + item_id + '"';
                        if (restaurant_status_id == 8 && restaurant_status_name != 'Order placed')
                            html += 'data-toggle="modal" data-target="#statusModal"';
                        html += '>' +
                            '<ul>' +
                            '<li>' +
                            '<label>Item Name</label>' +
                            '<span>: ' + item_name + '</span></li>' +
                            '<li>' +
                            '<label>Qty</label>' +
                            '<span>: ' + qty + '</span></li>' +
                            '</ul>' +
                            '<span class="';
                        if (restaurant_status_id == 9)
                            html += 'de-text';
                        else
                            html += 'cn-text';
                        html += '">' +
                            restaurant_status_name +
                            '</span>' +
                            '</div>';
                    }
                    $('.listing_content').append(html);

                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
        return false;
    },

    getHistory: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'order/history',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj);
                    var orders = obj.data;
                    var html = "";
                    if (orders.length > 0) {
                        for (var i = 0; i < orders.length; i++) {

                            var order_id = orders[i].id;
                            var batch_id = orders[i].batch_id;
                            var item_count = orders[i].item_count;
                            var created_at = orders[i].created_at;
                            var address = orders[i].address;
                            var status_id = orders[i].status_id;
                            var status_name = orders[i].status_name;

                            html += '<div class="list-bg">' +
                                '<ul>' +
                                '<li>' +
                                '<label>Batch Id</label>' +
                                '<span>: ' + batch_id + '</span>' +
                                '</li>' +
                                '<li>' +
                                '<label>Order Id</label>' +
                                '<span>: #' + order_id + '</span></li>' +
                                '<li>' +
                                '<label>Qty</label>' +
                                '<span>: ' + item_count + '</span></li>' +
                                '<li>' +
                                '<label>Time</label>' +
                                '<span>: ' + created_at + '</span></li>' +
                                '<li>' +
                                '<label>Drop Address</label>' +
                                '<span>: ' + address + '</span></li>' +
                                '</ul>' +
                                '<span class="';
                            if (status_id == 11)
                                html += 'de-text';
                            else
                                html += 'cn-text';
                            html += '">Delivered</span>' +
                                '</div>';
                        }
                    } else {
                        html = '<div class="list-bg">' +
                            '<h3>No orders in the history</h3>' +
                            '</div>';
                    }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getPackage: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'package/subscribed',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data;
                    var html = "";
                    if (orders.length > 0) {
                        for (var i = 0; i < orders.length; i++) {

                            var item_id = orders[i].item_id;
                            var item_name = orders[i].item_name;

                            html += '<div class="list-bg">' +
                                '<ul>' +
                                '<li>' +
                                '<label>Package</label>' +
                                '<span>: <a href="subscribers.html?item_id=' + item_id + '">' + item_name + '</a></span></li>' +
                                '</ul>' +
                                '</div>';
                        }
                    } else {
                        html = '<div class="list-bg">' +
                            '<h3>No orders in the history</h3>' +
                            '</div>';
                    }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getSubscribers: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var url_string = window.location.href;
        var url = new URL(url_string);
        var item_id = url.searchParams.get("item_id");

        var formData = new FormData();
        formData.append('token', token);
        formData.append('item_id', item_id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'package/subscribers',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data;
                    var html = "";
                    if (orders.length > 0) {
                        for (var i = 0; i < orders.length; i++) {

                            var order_id = orders[i].id;
                            var name = orders[i].user_name;

                            html += '<div class="list-bg">' +
                                '<a href="subscription.html?id=' + order_id + '&item_id=' + item_id + '">' +
                                '<ul>' +
                                '<li>' +
                                '<label><strong>Name</strong></label>' +
                                '<span>: ' + name + '</span></li>' +
                                '</ul>' +
                                '</a>' +
                                '</div>';
                        }
                    } else {
                        html = '<div class="list-bg">' +
                            '<h3>No orders in the history</h3>' +
                            '</div>';
                    }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getSubscription: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var url_string = window.location.href;
        var url = new URL(url_string);
        var order_id = url.searchParams.get("id");
        var item_id = url.searchParams.get("item_id");

        var formData = new FormData();
        formData.append('token', token);
        formData.append('id', order_id);
        formData.append('item_id', item_id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'package/subscription',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data;
                    var html = "";
                    // if(orders.length > 0){
                    for (var i = 0; i < orders.length; i++) {

                        var date = orders[i].start_date;
                        var brkfst = '',
                            lunch = '',
                            dinner = '';
                        console.log(orders[i].breakfast);
                        if (orders[i].breakfast != undefined)
                            brkfst = orders[i].breakfast;
                        if (orders[i].lunch != undefined)
                            lunch = orders[i].lunch;
                        if (orders[i].dinner != undefined)
                            dinner = orders[i].dinner;
                        html += '<tr>' +
                            '<td>' + date + '</td>' +
                            '<td>';
                        if (brkfst != '') {
                            html += '<i class="fa fa-check"></i>';
                        }
                        html += '</td>' +
                            '<td>';
                        if (lunch != '') {
                            html += '<i class="fa fa-check"></i>';
                        }
                        html += '</td>' +
                            '<td>';
                        if (dinner != '') {
                            html += '<i class="fa fa-check"></i>';
                        }
                        html += '</td>';
                        html += '</tr>';
                    }
                    // }
                    // else{
                    //     html = '<div class="list-bg">'+
                    //       '<h3>No orders in the history</h3>'+
                    //     '</div>';
                    // }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getProfile: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'view',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    localStorage.setItem('restra_data', JSON.stringify(obj.data));
                    var orders = obj.data;
                    var html = "";

                    var prof_image = orders.prof_image;
                    var restra_name = orders.name;
                    var email = orders.email;
                    // var fin_no = orders.fin_no;
                    var gst_no = orders.gst_no;
                    var open_at = orders.open_at;
                    var closes_at = orders.closes_at;
                    var phone_no = orders.phone_no;
                    var address = orders.address;
                    var role = orders.role;

                    html += '<div class="user-info"> <a href="javascript:;"><img src="' + prof_image + '" alt=""></a>' +
                        '<h3>' + restra_name + '</h3>' +
                        '<p>' + email + '</p>' +
                        //<!--<span class="edit-profile"><a href="{{ route('merchant.profile.edit') }}"><img src="{{ static_file('merchant/images/icon-edit-p.png') }}" alt=""></a></span>-->
                        '</div>' +
                        '<form >' +
                        // '<div class="form-group">'+
                        //     '<label>Fin No</label>'+
                        //   '<span>: '+fin_no+'</span>'+
                        // '</div>'+
                        '<div class="form-group">' +
                        '<label>GST No</label>' +
                        '<span>: ' + gst_no + '</span>' +
                        '</div>';
                    if (role == 'single') {
                        html += '<div class="form-group">' +
                            '<label>Open</label>' +
                            '<span>: ' + open_at + '</span>' +
                            '</div>' +
                            '<div class="form-group">' +
                            '<label>Closes</label>' +
                            '<span>: ' + closes_at + '</span>' +
                            '</div>';
                    }
                    html += '<div class="form-group">' +
                        '<label>Phone No</label>' +
                        '<span>: ' + phone_no + '</span>' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<label>Address</label>' +
                        '<span>: ' + address + '</span>' +
                        '</div>' +
                        '</form>';

                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    editProfile: function () {
        // var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var restra = $.parseJSON(localStorage.getItem('restra_data'));

        var html = "";
        var prof_image = restra.prof_image;
        var restra_name = restra.name;
        var email = restra.email;
        // var fin_no = restra.fin_no;
        var gst_no = restra.gst_no;
        var open_at = restra.open_at;
        var closes_at = restra.closes_at;
        var phone_no = restra.phone_no;
        var address = restra.address;
        var role = restra.role;

        html += '<div class="user-info">' +
            '<a href="#" class="take_picture"><img id="myImage" src="' + prof_image + '" alt=""></a>' +
            // <!-- <h3>Jumbo Seafood</h3> -->
            '<p>' + email + '</p>' +
            '</div>' +
            '<form>' +
            '<div class="form-group">' +
            '<input type="text" disabled autocomplete="name" class="form-control" placeholder="Restaurant Name" name="name" value="' + restra_name + '">' +
            '</div>' +
            // '<div class="form-group">'+
            //   '<input type="text" class="form-control" placeholder="Fin No" name="fin_no" value="'+fin_no+'">'+
            // '</div>'+
            '<div class="form-group">' +
            '<input type="text" disabled class="form-control" placeholder="GST No" name="gst_no" value="' + gst_no + '">' +
            '</div>';
        if (role == 'single') {
            html += '<div class="form-group">' +
                '<input type="time" class="form-control icon-time" placeholder="Opening Time" name="open_at" value="' + open_at + '">' +
                '</div>' +
                '<div class="form-group">' +
                '<input type="time" class="form-control icon-time" placeholder="Closing Time" name="closes_at" value="' + closes_at + '">' +
                '</div>';
        }

        html += '<div class="form-group">' +
            '<input type="text" autocomplete="tel-national" class="form-control" placeholder="Phone No" name="phone_no" value="' + phone_no + '">' +
            '</div>' +
            '<div class="form-group">' +
            '<input type="text" autocomplete="address-line1" class="form-control" placeholder="Address" name="address" value="' + address + '">' +
            '</div>' +
            '<div class="text-center mg-top">' +
            '<button type="button" class="btn btn-default update_profile">Submit</button>' +
            '</div>' +
            '</form>';

        $('.listing_content').append(html);
    },

    updateProfile: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var restra = $.parseJSON(localStorage.getItem('restra_data'));
        // var name = $('input[name=name]').val();
        // var fin_no = $('input[name=fin_no]').val();
        // var gst_no = $('input[name=gst_no]').val();
        var role = restra.role;
        var open_at = '';
        var closes_at = '';
        if (role == 'single') {
            open_at = $('input[name=open_at]').val();
            closes_at = $('input[name=closes_at]').val();
        }
        var phone_no = $('input[name=phone_no]').val();
        var address = $('input[name=address]').val();
        var image = $('#myImage').attr('src');
        var changed = $('#myImage').attr('changed');

        var formData = new FormData();
        formData.append('token', token);
        // formData.append('name', name);
        // formData.append('fin_no', fin_no);
        // formData.append('gst_no', gst_no);
        formData.append('open_at', open_at);
        formData.append('closes_at', closes_at);
        formData.append('phone_no', phone_no);
        formData.append('address', address);
        if (changed == 1) {
            formData.append('image', image);
        }

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'edit',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    app.onToast('Profile updated');
                    window.location.href = 'profile.html';
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getMenu: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var role = $.parseJSON(localStorage.getItem('user_data')).role;

        var tab_item = '<li class="active"><a class="active" href="create_menu.html">Add Item</a></li>';
        if (role == 'restaurant-owner-package') {
            tab_item = '<li class="active"><a class="active" href="create_package.html">Add Package</a></li>';
        }
        $('.add_item_btn').html(tab_item);

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'menu',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj);
                    var orders = obj.data;
                    localStorage.setItem('item_courses', JSON.stringify(obj.courses));
                    localStorage.setItem('item_category', JSON.stringify(obj.category));
                    var html = "";

                    if (orders.length > 0) {
                        for (var i = 0; i < orders.length; i++) {
                            var item_name = orders[i].name;
                            var item_id = orders[i].id;
                            var item_image = orders[i].image;
                            var description = orders[i].description;
                            var price = orders[i].price;
                            // var type = orders[i].type;
                            // var brkfst = orders[i].breakfast;
                            // var lunch = orders[i].lunch;
                            // var dinner = orders[i].dinner;

                            html += '<div class="menu-items">' +
                                '<div class="menu-left">' +
                                '<a href="menu_detail.html?id=' + item_id + '">' +
                                '<img src="' + item_image + '" alt="">' +
                                '</a>' +
                                '</div>' +
                                '<div class="menu-text">' +
                                '<h2><a href="menu_detail.html?id=' + item_id + '">' + item_name + '</a></h2>';
                            // if(type == 'package'){
                            //     html += '<h2>Breakfast - '+brkfst+' Lunch - '+lunch+' Dinner - '+dinner+'</h2>';
                            // }

                            html += '<p>' + description + '</p>' +
                                '<p>$' + price + '</p>' +
                                '</div>' +
                                '</div>';
                        }
                    } else {
                        html = '<div class="list-bg">' +
                            '<h3>Click on add to add items to menu.</h3>' +
                            '</div>';
                    }

                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getMenuView: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var url_string = window.location.href;
        var url = new URL(url_string);
        var item_id = url.searchParams.get("id");

        var formData = new FormData();
        formData.append('token', token);
        formData.append('id', item_id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'menu/view',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);

                    var orders = obj.data;
                    var html = "";

                    var item_id = orders.id;
                    var item_type = orders.type;
                    var item_image = orders.image;
                    var item_name = orders.name;
                    var description = orders.description;
                    var price = orders.price;

                    html += '<a href="javascript:;">' +
                        '<img src="' + item_image + '" alt="">' +
                        '</a>' +
                        '<h2>' + item_name + '</h2>' +
                        '<p>' + description + '</p>' +
                        '<p>Price: S$' + price + '</p>';

                    $('.listing_content').append(html);

                    var htm = '';
                    if (item_type == 'single') {
                        htm = '<a class="editmenu" href="edit_menu.html?item_id=' + item_id + '"><img src="images/icon-edit.png" alt=""></a>';
                        htm += '<a class="delMenu" href="javascript:;" data-id="' + item_id + '"><img src="images/icon-del.png" alt=""></a>';
                    } else {
                        htm = '<a class="editmenu" href="edit_package.html?item_id=' + item_id + '"><img src="images/icon-edit.png" alt=""></a>';
                        htm += '<a class="delMenu" href="javascript:;" data-id="' + item_id + '"><img src="images/icon-del.png" alt=""></a>';
                    }

                    $('.item_type_edit').append(htm);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    deleteItem: function (item_id) {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);
        formData.append('id', item_id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'item/delete',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    app.onToast(obj.message);
                    window.location.href = "menu.html";
                } else if (obj.status == 'error') {
                    app.onAlert(obj.message);
                }
            }
        });

    },

    createItem: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var courses = $.parseJSON(localStorage.getItem('item_courses'));
        var category = $.parseJSON(localStorage.getItem('item_category'));

        var sel_cat = '<select multiple name="category_id" class="form-control js-example-basic-multiple">';
        $.each(category, function (i, v) {
            sel_cat += '<option value="' + i + '">' + v + '</option>';
        });
        sel_cat += '</select>';

        var sel_co = '<select name="course_id" class="form-control js-example-basic-single">';
        $.each(courses, function (i, v) {
            sel_co += '<option value="' + i + '">' + v + '</option>';
        });
        sel_co += '</select>';

        $('.category_dropdown').append(sel_cat);
        $('.course_dropdown').append(sel_co);

        $('.js-example-basic-multiple').select2({
            placeholder: 'Select Options',
            containerCssClass: 'form-control',
            tags: true
        });

        $('.js-example-basic-single').select2({
            placeholder: 'Select Course',
            theme: "single form-control"
            // containerCssClass: 'form-control'
        });

    },

    saveItem: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var name = $('input[name=name]').val();
        var desc = $('[name=description]').val();
        var cat_ids = $('[name=category_id]').val();
        var course_id = $('[name=course_id]').val();
        var price = $('input[name=price]').val();
        var veg = $('input[name=is_veg]:checked').val();
        var halal = $('input[name=is_halal]:checked').val();

        var image = $('#myImage').attr('src');
        var changed = $('#myImage').attr('changed');

        if (veg == undefined) {
            veg = 0;
        }
        if (halal == undefined) {
            halal = 0;
        }

        var formData = new FormData();
        formData.append('token', token);
        formData.append('name', name);
        formData.append('description', desc);
        formData.append('tags', cat_ids);
        formData.append('course_id', course_id);
        formData.append('price', price);
        formData.append('is_veg', veg);
        formData.append('is_halal', halal);

        if (changed == 1) {
            formData.append('image', image);
        }

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'item/add',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    app.onToast('Item will be added to menu after its approved.');
                    window.location.href = 'menu.html';
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    editMenuView: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var courses = $.parseJSON(localStorage.getItem('item_courses'));
        var category = $.parseJSON(localStorage.getItem('item_category'));

        var sel_cat = '<select multiple name="category_id" class="form-control js-example-basic-multiple">';
        $.each(category, function (i, v) {
            sel_cat += '<option value="' + i + '">' + v + '</option>';
        });
        sel_cat += '</select>';

        var sel_co = '<select name="course_id" class="form-control js-example-basic-single">';
        $.each(courses, function (i, v) {
            sel_co += '<option value="' + i + '">' + v + '</option>';
        });
        sel_co += '</select>';

        var url_string = window.location.href;
        var url = new URL(url_string);
        var item_id = url.searchParams.get("item_id");

        var formData = new FormData();
        formData.append('token', token);
        formData.append('id', item_id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'menu/view',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);

                    var orders = obj.data;
                    var html = "";

                    var item_id = orders.id;
                    var item_type = orders.type;
                    var item_image = orders.edit_image;
                    var item_name = orders.name;
                    var description = orders.description;
                    var price = orders.price;
                    var is_veg = orders.is_veg;
                    var is_halal = orders.is_halal;
                    var course = orders.course_id;
                    var tags = orders.category;

                    html += '<div class="form-group">' +
                        '<input type="hidden" name="id" value="' + item_id + '">' +
                        '<input type="text" class="form-control" placeholder="Food Item" name="name" value="' + item_name + '">' +
                        '</div>' +
                        '<div class="form-group clearfix">' +
                        '<textarea class="form-control" name="description">' + description + '</textarea>' +
                        '</div>' +
                        '<div class="form-group">' +
                        sel_cat +
                        '</div>' +
                        '<div class="form-group">' +
                        sel_co +
                        '</div>' +
                        '<div class="form-group input-group">' +
                        '<span class="input-group-addon">$</span>' +
                        '<input type="number" min="0" step="0.01" class="form-control" placeholder="Price" name="price" value="' + price + '">' +
                        '</div>' +
                        '<div class="form-group clearfix">' +
                        '<div class=" pull-left custom-check-form form-checkbox">' +
                        '<input id="Vegetarian"  name="is_veg" value="1"';
                    if (is_veg == 1)
                        html += ' checked ';
                    html += 'type="checkbox">' +
                        '<label for="Vegetarian">Vegetarian</label>' +
                        '</div>' +
                        '<div class=" pull-left custom-check-form form-checkbox">' +
                        '<input id="Halal"  name="is_halal" value="1"';
                    if (is_halal == 1)
                        html += ' checked ';
                    html += 'type="checkbox">' +
                        '<label for="Halal">Halal</label>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group clearfix">' +
                        '<div class="clearfix">' +
                        '<div class="select_picture">' +
                        '<img id="myImage" style="width: 100px; height: 100px;" src="' + item_image + '" alt="">' +
                        '</div>' +
                        // '<input type="hidden" class="form-control col-md-7 col-xs-12" name="path">'+
                        // <!-- <a class="add-more" href="#"><img src="{{ static_file('merchant/images/icon-add.png') }}" alt=""></a> -->
                        '</div>' +
                        '</div>' +
                        '<div class="text-center mg-top">' +
                        '<button type="button" class="btn btn-default update_item">Update</button>' +
                        '</div>';

                    $('.listing_content').append(html);
                    $('.js-example-basic-multiple').select2({
                        placeholder: 'Select Options',
                        containerCssClass: 'form-control',
                        tags: true
                    });
                    $('.js-example-basic-multiple').val(tags).trigger('change');

                    $('.js-example-basic-single').select2({
                        placeholder: 'Select Course',
                        theme: "single form-control"
                        // containerCssClass: 'form-control'
                    });
                    $('.js-example-basic-single').val(course).trigger('change');
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    updateItem: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var id = $('input[name=id]').val();
        var name = $('input[name=name]').val();
        var desc = $('[name=description]').val();
        var cat_ids = $('[name=category_id]').val();
        var course_id = $('[name=course_id]').val();
        var price = $('input[name=price]').val();
        var veg = $('input[name=is_veg]:checked').val();
        var halal = $('input[name=is_halal]:checked').val();

        var image = $('#myImage').attr('src');
        var changed = $('#myImage').attr('changed');

        if (veg == undefined) {
            veg = 0;
        }
        if (halal == undefined) {
            halal = 0;
        }

        var formData = new FormData();
        formData.append('token', token);
        formData.append('id', id);
        formData.append('name', name);
        formData.append('description', desc);
        formData.append('tags', cat_ids);
        formData.append('course_id', course_id);
        formData.append('price', price);
        formData.append('is_veg', veg);
        formData.append('is_halal', halal);

        if (changed == 1) {
            formData.append('image', image);
        }

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'menu/item/update',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    app.onToast('Item updated.');
                    window.location.href = 'menu.html';
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    createPackage: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var category = $.parseJSON(localStorage.getItem('item_category'));

        var sel_cat = '<select multiple name="category_id" class="form-control js-example-basic-multiple">';
        $.each(category, function (i, v) {
            sel_cat += '<option value="' + i + '">' + v + '</option>';
        });
        sel_cat += '</select>';

        $('.category_dropdown').append(sel_cat);

        $('.js-example-basic-multiple').select2({
            placeholder: 'Select Options',
            containerCssClass: 'form-control',
            tags: true
        });
    },

    savePackage: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var name = $('input[name=name]').val();
        var desc = $('[name=description]').val();
        var cat_ids = $('[name=category_id]').val();
        var price = $('input[name=price]').val();
        var breakfast = $('input[name=breakfast]').val();
        var lunch = $('input[name=lunch]').val();
        var dinner = $('input[name=dinner]').val();
        var veg = $('input[name=is_veg]:checked').val();
        var halal = $('input[name=is_halal]:checked').val();

        /*var image = $('#myImage').attr('src');
        var changed = $('#myImage').attr('changed');*/

        var changed = '';
        image = [];
        $('#multiImages img').each(function (i, item) {
            var imgSrc = $(this).attr('src');
            changed = $(this).attr('changed') || $(this).attr('new');
            if (changed == 1) {
                image.push(imgSrc);
                /*app.imageBase64(imgSrc, function (base64Img) {
                    console.log(base64Img);
                    image.push(base64Img);
                });*/
            } else {
                image.push('0');
            }
        });

        if (veg == undefined) {
            veg = 0;
        }
        if (halal == undefined) {
            halal = 0;
        }

        var formData = new FormData();
        formData.append('token', token);
        formData.append('name', name);
        formData.append('description', desc);
        formData.append('tags', cat_ids);
        formData.append('price', price);
        formData.append('breakfast', breakfast);
        formData.append('lunch', lunch);
        formData.append('dinner', dinner);
        formData.append('is_veg', veg);
        formData.append('is_halal', halal);
        console.log(image);
        formData.append('image', image);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'package/add',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    app.onToast('Package added');
                    window.location.href = 'menu.html';
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    editPackageView: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var category = $.parseJSON(localStorage.getItem('item_category'));

        var sel_cat = '<select multiple name="category_id" class="form-control js-example-basic-multiple">';
        $.each(category, function (i, v) {
            sel_cat += '<option value="' + i + '">' + v + '</option>';
        });
        sel_cat += '</select>';

        var url_string = window.location.href;
        var url = new URL(url_string);
        var item_id = url.searchParams.get("item_id");

        var formData = new FormData();
        formData.append('token', token);
        formData.append('id', item_id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'package/view',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);

                    var orders = obj.data;
                    var html = "";

                    var item_id = orders.id;
                    var item_type = orders.type;
                    var item_image = orders.image;
                    var item_name = orders.name;
                    var description = orders.description;
                    var price = orders.price;
                    var is_veg = orders.is_veg;
                    var is_halal = orders.is_halal;
                    var item_breakfast = orders.breakfast;
                    var item_lunch = orders.lunch;
                    var item_dinner = orders.dinner;
                    var tags = orders.category;

                    html += '<div class="form-group">' +
                        '<input type="hidden" name="id" value="' + item_id + '">' +
                        '<input type="text" class="form-control" placeholder="Package Item" name="name" value="' + item_name + '">' +
                        '</div>' +
                        '<div class="form-group clearfix">' +
                        '<textarea class="form-control" name="description">' + description + '</textarea>' +
                        '</div>' +
                        '<div class="form-group">' +
                        sel_cat +
                        '</div>' +
                        '<div class="form-group">' +
                        '<input type="text" class="form-control" placeholder="No. of days for Breakfast" name="breakfast" value="' + item_breakfast + '">' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<input type="text" class="form-control" placeholder="No. of days for Lunch" name="lunch" value="' + item_lunch + '">' +
                        '</div>' +
                        '<div class="form-group">' +
                        '<input type="text" class="form-control" placeholder="No. of days for Dinner" name="dinner" value="' + item_dinner + '">' +
                        '</div>' +
                        '<div class="form-group input-group">' +
                        '<span class="input-group-addon">$</span>' +
                        '<input type="number" min="0" step="0.01" class="form-control" placeholder="Price" name="price" value="' + price + '">' +
                        '</div>' +
                        '<div class="form-group clearfix">' +
                        '<div class=" pull-left custom-check-form form-checkbox">' +
                        '<input id="Vegetarian" name="is_veg" value="1"';
                    if (is_veg == 1)
                        html += ' checked ';
                    html += 'type="checkbox">' +
                        '<label for="Vegetarian">Vegetarian</label>' +
                        '</div>' +
                        '<div class=" pull-left custom-check-form form-checkbox">' +
                        '<input id="Halal" name="is_halal" value="1"';
                    if (is_halal == 1)
                        html += ' checked ';
                    html += 'type="checkbox">' +
                        '<label for="Halal">Halal</label>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group clearfix">' +
                        '<div class="clearfix">' +
                        '<div class="image_area"> <div class="select_picture" data-image-id="1">' +
                        '<img id="myImage_1" style="width: 100px; height: 100px;" src="' + item_image + '" alt="">' +
                        '</div></div>' +
                        // <!-- <img src="{{ static_file('merchant/images/img-placeholder.png') }}" alt=""> -->
                        '<a class="add-more" href="javascript:;" data-id="1"><img src="images/icon-add.png" alt=""></a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="text-center mg-top">' +
                        '<button type="button" class="btn btn-default update_package">Update</button>' +
                        '</div>';

                    $('.listing_content').append(html);
                    $('.js-example-basic-multiple').select2({
                        placeholder: 'Select Options',
                        containerCssClass: 'form-control',
                        tags: true
                    });

                    $('.js-example-basic-multiple').val(tags).trigger('change');
                    // $('.js-example-basic-multiple').select2('val',tt);

                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    updatePackage: function () {

        var token = $.parseJSON(localStorage.getItem('user_data')).token;
        var id = $('input[name=id]').val();
        var name = $('input[name=name]').val();
        var desc = $('[name=description]').val();
        var cat_ids = $('[name=category_id]').val();
        var price = $('input[name=price]').val();
        var breakfast = $('input[name=breakfast]').val();
        var lunch = $('input[name=lunch]').val();
        var dinner = $('input[name=dinner]').val();
        var veg = $('input[name=is_veg]:checked').val();
        var halal = $('input[name=is_halal]:checked').val();

        var image = [];
        var changed = '';
        $('.select_picture').each(function (i, e) {
            var j = i + 1;
            changed = $('#myImage_' + j).attr('changed');
            if (changed == 1) {
                image.push($('#myImage_' + j).attr('src'));
            } else {
                image.push('0');
            }
        });
        // return false;
        // var image = $('#myImage').attr('src');
        // var changed = $('#myImage').attr('changed');

        if (veg == undefined) {
            veg = 0;
        }
        if (halal == undefined) {
            halal = 0;
        }

        var formData = new FormData();
        formData.append('token', token);
        formData.append('id', id);
        formData.append('name', name);
        formData.append('description', desc);
        formData.append('tags', cat_ids);
        formData.append('price', price);
        formData.append('breakfast', breakfast);
        formData.append('lunch', lunch);
        formData.append('dinner', dinner);
        formData.append('is_veg', veg);
        formData.append('is_halal', halal);

        formData.append('image', image);
        // if(changed == 1){
        // }

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'package/update',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    app.onToast('Package updated');
                    window.location.href = 'menu.html';
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getAccount: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var formData = new FormData();
        formData.append('token', token);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'account',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data;
                    var html = "";
                    if (orders.length > 0) {
                        for (var i = 0; i < orders.length; i++) {

                            var sub_total = orders[i].sub_total;
                            var batch_id = orders[i].batch_id;

                            html += '<div class="account-info clearfix">' +
                                '<div class="pull-left">' +
                                '<h2>Batch Id : <a href="account_details.html?batch_id=' + batch_id + '">' +
                                '#' + batch_id + '</a>' +
                                '</h2>' +
                                '</div>' +
                                '<div class="pull-right">' +
                                '<h1>Total Price : S$' + sub_total + '</h1>' +
                                '</div>' +
                                '</div>';
                        }
                    } else {
                        html = '<div class="list-bg">' +
                            '<h3>No account history yet.</h3>' +
                            '</div>';
                    }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getAccountDetail: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var url_string = window.location.href;
        var url = new URL(url_string);
        var id = url.searchParams.get("batch_id");

        var inv_href = 'invoice.html?batch_id=' + id;
        $('.invoice_href').attr('href', inv_href);
        var formData = new FormData();
        formData.append('token', token);
        formData.append('batch_id', id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'account/detail',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var orders = obj.data;
                    var html = "";
                    if (orders.length > 0) {
                        for (var i = 0; i < orders.length; i++) {

                            var item_name = orders[i].name;
                            var qty = orders[i].quantity;
                            var total_price = orders[i].price;

                            html += '<div class="list-bg">' +
                                '<ul>' +
                                '<li>' +
                                '<label>Item Name</label>' +
                                '<span>: ' + item_name + '</span></li>' +
                                '<li>' +
                                '<label>Qty</label>' +
                                '<span>: ' + qty + '</span></li>' +
                                '<li>' +
                                '<label>Total Price</label>' +
                                '<span>: S$' + total_price + '</span></li>' +
                                '</ul>' +
                                '</div>';
                        }
                    } else {
                        html = '<div class="list-bg">' +
                            '<h3>No details available.</h3>' +
                            '</div>';
                    }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    getInvoiceDetail: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        var url_string = window.location.href;
        var url = new URL(url_string);
        var id = url.searchParams.get("batch_id");

        var formData = new FormData();
        formData.append('token', token);
        formData.append('batch_id', id);

        $.ajax({
            url: GLOBAL.baseUrl + GLOBAL.prefix + 'invoice/detail',
            type: 'POST',
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStart("Loading...", {});
                }
            },
            complete: function (data) {
                if (typeof SpinnerPlugin != 'undefined') {
                    SpinnerPlugin.activityStop();
                }
            },
            success: function (data) {
                var obj = data;
                if (obj.status == 'success') {
                    console.log(obj.data);
                    var items = obj.data.items;
                    var invoice = obj.data.invoice;
                    var html = "";
                    if (items.length > 0) {
                        var inv_id = invoice.id;
                        var inv_date = invoice.created_at;
                        var inv_status = invoice.status;

                        html += '<h2>Invoice No <span>: #' + inv_id + '</span>' +
                            '<span class="pull-right badge">' + inv_status + '</span>' +
                            '</h2>' +
                            '<h2>Invoice Date <span>: ' + inv_date + '</span></h2>' +
                            '<table class="table-grid" width="100%%" cellspacing="0" cellpadding="0">' +
                            '<tr class="row-line">' +
                            '<td>Item Name</td>' +
                            '<td style="text-align:right;">Amount</td>' +
                            '</tr>';
                        var item_name, item_price, item_qty, total;
                        for (var i = 0; i < items.length; i++) {
                            total = 0;
                            item_name = items[i].name;
                            item_price = items[i].price;
                            item_qty = items[i].quantity;

                            html += '<tr class="row-line">' +
                                '<td> ' + item_name + '<span>S$' + item_price + ' x ' + item_qty + '</span></td>' +
                                '<td style="text-align:right;">S$' + item_price * item_qty + '</td>' +
                                '</tr>';
                            total += item_price * item_qty;
                        }

                        html += '<tr>' +
                            '<td style="text-align:right;">Sub Total</td>' +
                            '<td style="text-align:right;">S$' + total + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align:right;">Sales Tax</td>' +
                            '<td style="text-align:right;">S$0</td>' +
                            '</tr>' +
                            '<tr class="row-line">' +
                            '<td style="text-align:right;">WLC Charges</td>' +
                            '<td style="text-align:right;">S$0</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td style="text-align:right; font-weight:bold;">Total Paid:</td>' +
                            '<td style="text-align:right; font-weight:bold;">S$' + total + '</td>' +
                            '</tr>' +
                            '</table>';

                    } else {
                        html = '<div class="list-bg">' +
                            '<h3>No details available.</h3>' +
                            '</div>';
                    }
                    $('.listing_content').append(html);
                } else if (obj.status == 'error') {
                    app.onAlert(obj.status_message);
                }
            }
        });
    },

    logout: function () {
        var token = $.parseJSON(localStorage.getItem('user_data')).token;

        // localStorage.clear();
        window.location.href = "index.html";

        var formData = new FormData();
        formData.append('token', token);

        // $.ajax({
        //     url: GLOBAL.baseUrl+'logout',
        //     type: 'POST',
        //     data: formData,
        //     crossDomain: true,
        //     cache: false,
        //     contentType: false,
        //     processData: false,
        //     //beforeSend: function () {
        //         //    $(objct).val('Connecting...');
        //     //},
        //     success: function (data) {
        //         var obj = data;
        //         if (obj.status == 'success') {
        //             localStorage.clear();
        //             window.location.href="index.html";
        //         }
        //         else if (obj.status == 'error') {
        //             app.onAlert(obj.status_message);
        //         }
        //     }
        // });
    },
    imageBase64: function (url, callback, outputFormat) {
        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            img = new Image;
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var dataURL;
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            dataURL = canvas.toDataURL(outputFormat); // the base64 data of the image
            //            dataURL = dataURL.substring("data:image/png;base64,".length);
            callback.call(this, dataURL);
            canvas = null;
        };
        img.src = url;
    }
};

app.initialize();
