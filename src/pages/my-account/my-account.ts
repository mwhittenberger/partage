import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
//import {HttpClient} from '@angular/common/http';
import {Storage} from '@ionic/storage';
import {Observable} from 'rxjs/Observable';
import {WpServiceProvider} from "../../providers/wp-service/wp-service";
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {ToastController} from 'ionic-angular';


@Component({
    selector: 'page-my-account',
    templateUrl: 'my-account.html',
    providers: [WpServiceProvider],


})
export class MyAccountPage {

    wpUser: Observable<any>;
    userMeta: Observable<any>;
    updateResult: Observable<any>;
    firstName: string;
    userLogin: string;
    userCookie: string;
    gender: string;
    fbToken: string;
    age: string;
    availability: string;
    city: string;
    fantasies: string;
    personality: string;
    relationship: string;
    desire: string;
    duration: string;
    experience: string;
    frequency: string;
    haveKids: string;
    lowerAgeRange: string;
    married: string;
    poly: string;
    schedule: string;
    sharingLevel: string;
    spectrum: string;
    state: string;
    upperAgeRange: string;
    lookingFor: string;
    willingToHost: string;
    userProfileForm: FormGroup;
    metaValues: string;
    isDisabled: boolean = true;
    firstNameClasses: any;
    ageClasses: any;
    cityClasses: any;
    genderClasses: any;
    stateClasses: any;
    marriedClasses: any;
    durationClasses: any;
    polyClasses: any;
    kidsClasses: any;
    spectrumClasses: any;
    sharingClasses: any;
    experienceClasses: any;
    hostClasses: any;
    desireClasses: any;
    scheduleClasses: any;
    frequencyClasses: any;
    looksClasses: any;
    relationshipClasses: any;
    fantasiesClasses: any;
    lookingClasses: any;
    venueQ: string;
    avail: string;
    venues: string = '';
    agePreference:any= {lower: 21, upper: 65};


    constructor(public navCtrl: NavController, public navParams: NavParams, public wpService: WpServiceProvider, public storage: Storage, public formBuilder: FormBuilder, public toastCtrl: ToastController) {



        this.userProfileForm = this.formBuilder.group({
            firstName: new FormControl('', Validators.required),
            age: new FormControl('', Validators.pattern('[0-9]{2}')),
            gender: new FormControl(''),
            city: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            married: new FormControl('', Validators.required),
            duration: new FormControl('', Validators.required),
            poly: new FormControl('', Validators.required),
            have_kids: new FormControl('', Validators.required),
            spectrum: new FormControl('', Validators.required),
            sharing_level: new FormControl('', Validators.required),
            experience: new FormControl('', Validators.required),
            availability1: new FormControl(false),
            availability2: new FormControl(false),
            venue1: new FormControl(false),
            venue2: new FormControl(false),
            venue3: new FormControl(false),
            willing_to_host: new FormControl('', Validators.required),
            desire: new FormControl('', Validators.required),
            schedule: new FormControl('', Validators.required),
            frequency: new FormControl('', Validators.required),
            looks: new FormControl('', Validators.required),
            relationship: new FormControl('', Validators.required),
            fantasies: new FormControl('', Validators.required),
            looking: new FormControl('', Validators.required),
            //agePreference: new FormControl([{lower: 21, upper: 65}])
        });

        this.storage.get('fbToken').then((val) => {
            this.fbToken = val;
            this.wpUser = this.wpService.loginOrRegisterFacebook(this.fbToken);
            this.wpUser.subscribe(data => {
                console.log('my data ', data);
                this.userLogin = data.user_login;
                this.userCookie = data.cookie;

                this.userMeta = this.wpService.getUserMeta(this.userCookie);
                this.userMeta.subscribe(
                    data => {
                        console.log('my meta ', data);
                        this.assignMetaFields(data);
                    },
                    error => console.log("Error: ", error),
                    () => {

                        this.agePreference = {lower: parseInt(this.lowerAgeRange), upper: parseInt(this.upperAgeRange)};
                        //this.agePreference = {lower: 24, upper: 36};
                        this.userProfileForm.patchValue({
                            firstName: this.firstName,
                            age: this.age,
                            gender: this.gender,
                            city: this.city,
                            state: this.state,
                            married: this.married,
                            duration: this.duration,
                            poly: this.poly,
                            have_kids: this.haveKids,
                            spectrum: this.spectrum,
                            sharing_level: this.sharingLevel,
                            experience: this.experience,
                            willing_to_host: this.willingToHost,
                            desire: this.desire,
                            schedule: this.schedule,
                            frequency: this.frequency,
                            looks: this.personality,
                            relationship: this.relationship,
                            fantasies: this.fantasies,
                            looking: this.lookingFor,

                        });
                        this.isDisabled = false;
                        if(this.availability.includes('weekends')) {
                            this.userProfileForm.patchValue({availability1: true});
                        }
                        if(this.availability.includes('weekdays')) {
                            this.userProfileForm.patchValue({availability2: true});
                        }

                        if(this.venueQ.includes('private-party')) {
                            this.userProfileForm.patchValue({venue1: true});
                        }
                        if(this.venueQ.includes('club')) {
                            this.userProfileForm.patchValue({venue2: true});
                        }
                        if(this.venueQ.includes('hotel')) {
                            this.userProfileForm.patchValue({venue3: true});
                        }

                    }
                );

            });


        });

    }

    assignMetaFields(data) {
        this.firstName = data.first_name;
        this.age = data.age;
        this.gender = data.gender;
        this.availability = data.availability;
        this.city = data.city;
        this.fantasies = data.describe_your_fantasies;
        this.personality = data.describe_your_partners_looks_and_personality;
        this.relationship = data.describe_your_relationship;
        this.desire = data.desire;
        this.duration = data.duration;
        this.experience = data.experience;
        this.frequency = data.frequency;
        this.haveKids = data.have_kids;
        this.lowerAgeRange = data.lower_age_range;
        console.log('low range is '+this.lowerAgeRange);
        this.married = data.married;
        this.poly = data.poly;
        this.schedule = data.schedule;
        this.sharingLevel = data.sharing_level;
        this.spectrum = data.spectrum;
        this.state = data.state;
        this.upperAgeRange = data.upper_age_range;
        this.lookingFor = data.what_are_you_looking_for;
        this.willingToHost = data.willing_to_host;
        this.venueQ = data.venue;
    }

    onSubmit(value: any): void {
        if (this.userProfileForm.valid) {

            if(value.availability1 == true && value.availability2 == true) {
                this.avail = 'weekends, weekdays';
            }
            if(value.availability1 == true && value.availability2 == false) {
                this.avail = 'weekends';
            }
            if(value.availability1 == false && value.availability2 == true) {
                this.avail = 'weekdays';
            }

            if(value.venue1 == true) {
                this.venues = 'private-party';
            }
            if(value.venue2 == true) {
                if(this.venues == '')
                    this.venues = 'club';
                else
                    this.venues = this.venues+', club';
            }
            if(value.venue3 == true) {
                if(this.venues == '')
                    this.venues = 'hotel';
                else
                    this.venues = this.venues+', hotel';
            }




            this.metaValues = '&lower_age_range='+this.agePreference.lower+'&upper_age_range='+this.agePreference.upper+'&first_name='+value.firstName+'&age='+value.age+'&gender='+value.gender+'&city='+value.city+'&state='+value.state+'&married='+value.married+'&duration='+value.duration+'&poly='+value.poly+'&have_kids='+value.have_kids+'&spectrum='+value.spectrum+'&sharing_level='+value.sharing_level+'&experience='+value.experience+'&willing_to_host='+value.willing_to_host+'&desire='+value.desire+'&schedule='+value.schedule+'&frequency='+value.frequency+'&describe_your_partners_looks_and_personality='+value.looks+'&describe_your_relationship='+value.relationship+'&describe_your_fantasies='+value.fantasies+'&what_are_you_looking_for='+value.looking+'&availability='+this.avail+"&venue="+this.venues;
            console.log('sending '+this.metaValues);

            this.updateResult = this.wpService.updateMeta(this.userCookie, this.metaValues);
            this.updateResult.subscribe(
                data => {
                    console.log('results ', data);

                });


            const toast = this.toastCtrl.create({
                message: 'Profile Updated',
                duration: 3000
            });
            toast.present();
        }
        else {

            if(value.firstName == '') {
                this.firstNameClasses = 'error';
            }

            if(value.age == '' || !(parseInt(value.age) > 21 && parseInt(value.age) < 65)) {
                this.ageClasses = 'error';
            }

            if(value.gender == '') {
                this.genderClasses = 'error';
            }

            if(value.city == '') {
                this.cityClasses = 'error';
            }

            if(value.state == '') {
                this.stateClasses = 'error';
            }

            if(value.married == '') {
                this.marriedClasses = 'error';
            }

            if(value.duration == '' || !(parseInt(value.duration) >= 0 && parseInt(value.duration) < 100)) {
                this.ageClasses = 'error';
            }

            if(value.poly == '') {
                this.polyClasses = 'error';
            }

            if(value.have_kids == '') {
                this.kidsClasses = 'error';
            }

            if(value.spectrum == '') {
                this.spectrumClasses = 'error';
            }

            if(value.sharing_level == '') {
                this.sharingClasses = 'error';
            }

            if(value.experience == '') {
                this.experienceClasses = 'error';
            }

            if(value.willing_to_host == '') {
                this.hostClasses = 'error';
            }

            if(value.desire == '') {
                this.desireClasses = 'error';
            }

            if(value.schedule == '') {
                this.scheduleClasses = 'error';
            }

            if(value.frequency == '') {
                this.frequencyClasses = 'error';
            }

            if(value.looks == '') {
                this.looksClasses = 'error';
            }

            if(value.relationship == '') {
                this.relationshipClasses = 'error';
            }

            if(value.fantasies == '') {
                this.fantasiesClasses = 'error';
            }

            if(value.looking == '') {
                this.lookingClasses = 'error';
            }


            const toast = this.toastCtrl.create({
                message: 'Validation Error - Please check the fields in red',
                duration: 3000
            });
            toast.present();
        }
    }




}
