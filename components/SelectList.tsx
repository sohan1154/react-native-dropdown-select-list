import { ScaleFromCenterAndroidSpec } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionSpecs';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Animated,
    TextInput,
} from 'react-native';

import { SelectListProps } from '..';

type L1Keys = { key?: any; value?: any; disabled?: boolean | undefined }

const SelectList: React.FC<SelectListProps> = ({
    setSelected,
    placeholder,
    boxStyles,
    inputStyles,
    dropdownStyles,
    dropdownItemStyles,
    dropdownTextStyles,
    displayAddNewButton,
    selectedStyles,
    maxHeight,
    data,
    defaultOption,
    searchicon = false,
    arrowicon = false,
    closeicon = false,
    search = true,
    searchPlaceholder = "search",
    notFoundText = "No data found",
    disabledItemStyles,
    disabledTextStyles,
    onSelect = () => { },
    save = 'key',
    dropdownShown = false,
    fontFamily
}) => {

    const oldOption = React.useRef(null)
    const [_firstRender, _setFirstRender] = React.useState<boolean>(true);
    const [dropdown, setDropdown] = React.useState<boolean>(dropdownShown);
    const [selectedval, setSelectedVal] = React.useState<any>("");
    const [height, setHeight] = React.useState<number>(200)
    const animatedvalue = React.useRef(new Animated.Value(0)).current;
    const [filtereddata, setFilteredData] = React.useState(data)
    const [searchKeyword, setSearchKeyword] = React.useState<any>(null)


    const slidedown = () => {
        setDropdown(true)
        Animated.timing(animatedvalue, {
            toValue: height,
            duration: 500,
            useNativeDriver: false,

        }).start()
    }
    const slideup = () => {

        Animated.timing(animatedvalue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,

        }).start(() => setDropdown(false))
    }

    React.useEffect(() => {
        if (maxHeight)
            setHeight(maxHeight)
    }, [maxHeight])


    React.useEffect(() => {
        setFilteredData(data);
    }, [data])


    React.useEffect(() => {
        if (_firstRender) {
            _setFirstRender(false);
            return;
        }
        onSelect()
    }, [selectedval])


    React.useEffect(() => {
        if (!_firstRender && defaultOption && oldOption.current != defaultOption.key) {
            // oldOption.current != null
            oldOption.current = defaultOption.key
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.value);
        }
        if (defaultOption && _firstRender && defaultOption.key != undefined) {

            oldOption.current = defaultOption.key
            setSelected(defaultOption.key);
            setSelectedVal(defaultOption.value);
        }

    }, [defaultOption])

    React.useEffect(() => {
        if (!_firstRender) {
            if (dropdownShown)
                slidedown();
            else
                slideup();

        }

    }, [dropdownShown])



    return (
        <View>
            {
                (dropdown && search)
                    ?
                    <View style={[styles.wrapper, boxStyles]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            {
                                (!searchicon)
                                    ?
                                    <Image
                                        source={require('../assets/images/search.png')}
                                        resizeMode='contain'
                                        style={{ width: 20, height: 20, marginRight: 7 }}
                                    />
                                    :
                                    searchicon
                            }

                            <TextInput
                                placeholder={searchPlaceholder}
                                onChangeText={(val) => {
                                    let result = data.filter((item: L1Keys) => {
                                        val.toLowerCase();
                                        let row = item.value.toLowerCase()
                                        return row.search(val.toLowerCase()) > -1;
                                    });
                                    setSearchKeyword(val)
                                    setFilteredData(result)
                                }}
                                style={[{ padding: 0, height: 20, flex: 1, fontFamily }, inputStyles]}
                            />
                            <TouchableOpacity onPress={() => slideup()} >

                                {
                                    (!closeicon)
                                        ?
                                        <Image
                                            source={require('../assets/images/close.png')}
                                            resizeMode='contain'
                                            style={{ width: 17, height: 17 }}
                                        />
                                        :
                                        closeicon
                                }

                            </TouchableOpacity>


                        </View>

                    </View>
                    :
                    <TouchableOpacity style={[styles.wrapper, boxStyles]} onPress={() => { if (!dropdown) { slidedown() } else { slideup() } }}>
                        <Text style={[{ fontFamily }, inputStyles]}>{(selectedval == "") ? (placeholder) ? placeholder : 'Select option' : selectedval}</Text>
                        {
                            (!arrowicon)
                                ?
                                <Image
                                    source={require('../assets/images/chevron.png')}
                                    resizeMode='contain'
                                    style={{ width: 20, height: 20 }}
                                />
                                :
                                arrowicon
                        }

                    </TouchableOpacity>
            }

            {
                (dropdown)
                    ?
                    <Animated.View style={[{ maxHeight: animatedvalue }, styles.dropdown, dropdownStyles]}>
                        <ScrollView contentContainerStyle={{ paddingVertical: 10, overflow: 'hidden' }} nestedScrollEnabled={true}>

                            {
                                (filtereddata.length >= 1)
                                    ?
                                    filtereddata.map((item: L1Keys, index: number) => {
                                        let key = item.key ?? item.value ?? item;
                                        let value = item.value ?? item;
                                        let disabled = item.disabled ?? false;
                                        if (disabled) {
                                            return (
                                                <TouchableOpacity style={[styles.disabledoption, disabledItemStyles]} key={index} onPress={() => { }}>
                                                    <Text style={[{ color: '#c4c5c6', fontFamily }, disabledTextStyles]}>{value}</Text>
                                                </TouchableOpacity>
                                            )
                                        } else {
                                            return (
                                                <TouchableOpacity style={[styles.option, dropdownItemStyles]} key={index} onPress={() => {
                                                    if (save === 'value') {
                                                        setSelected(value);
                                                    } else {
                                                        setSelected(key)
                                                    }

                                                    setSelectedVal(value)
                                                    slideup()
                                                    setTimeout(() => { setFilteredData(data) }, 800)

                                                }}>
                                                    {(selectedval == value)
                                                        ?
                                                        <Text style={[{ fontFamily }, dropdownTextStyles, selectedStyles]}>{value}</Text>
                                                        :
                                                        <Text style={[{ fontFamily }, dropdownTextStyles]}>{value}</Text>
                                                    }
                                                </TouchableOpacity>
                                            )
                                        }

                                    })
                                    :
                                    <>
                                        {displayAddNewButton ?
                                            <View style={[styles.option, styles.noRecord, dropdownItemStyles]}>
                                                <Text style={[{ fontFamily }, dropdownTextStyles]}>
                                                    {notFoundText}
                                                </Text>

                                                <TouchableOpacity style={[styles.primaryBtn]}
                                                    onPress={() => {
                                                        setSelected(searchKeyword)
                                                        setSelectedVal(searchKeyword)
                                                        slideup()
                                                        setTimeout(() => setFilteredData(data), 800)
                                                    }}
                                                >
                                                    <Text style={[styles.primaryTxt]}>+ Add New Category</Text>
                                                </TouchableOpacity>
                                            </View>
                                            :
                                            <>
                                                <TouchableOpacity style={[styles.option, styles.noRecord, dropdownItemStyles]}
                                                    onPress={() => {
                                                        setSelected(undefined)
                                                        setSelectedVal(null)
                                                        slideup()
                                                        setTimeout(() => setFilteredData(data), 800)
                                                    }}
                                                >
                                                    <Text style={[{ fontFamily }, dropdownTextStyles]}>
                                                        {notFoundText}
                                                    </Text>
                                                </TouchableOpacity>
                                            </>
                                        }
                                    </>
                            }



                        </ScrollView>
                    </Animated.View>
                    :
                    null
            }


        </View>
    )
}


export default SelectList;


const styles = StyleSheet.create({
    noRecord: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    primaryBtn: {
        // // marginBottom: (20),
        // paddingVertical: (5),
        // borderRadius: (10),
        // borderWidth: (1),
        // overflow: "hidden",
        // // maxHeight: (50),
        // backgroundColor: "#F26343",
        // borderColor: "#F26343",
        // marginRight: 'auto',
    },
    primaryTxt: {
        textAlign: "center",
        color: "#F26343",
        textTransform: "uppercase",
        paddingHorizontal: 10
    },
    wrapper: { borderWidth: 1, borderRadius: 10, borderColor: 'gray', paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' },
    dropdown: { borderWidth: 1, borderRadius: 10, borderColor: 'gray', marginTop: 10, overflow: 'hidden' },
    option: { paddingHorizontal: 20, paddingVertical: 8, overflow: 'hidden' },
    disabledoption: { paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'whitesmoke', opacity: 0.9 }

})
